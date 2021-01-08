import { LayoutController } from "./layoutController.component";

export enum Layout {
	LANDSCAPE,
	DESKTOP,
	PORTRAIT,
}

// export enum Layout {
//   PORTRAIT = "PORTRAIT",
//   DESKTOP = "DESKTOP",
//   LANDSCAPE = "LANDSCAPE"
// }
const portraitRatio = 0.5625; /** 720/1280 */
const landscapeRatio = 1.778;

const gameDiv = document.getElementById("GameDiv");
let _curLayout = undefined;
let _canvas = null;

const _resizeQueue = [];
const _orientationQueue = [];
const _layoutQueue = [];

window.addEventListener("orientationchange", () => {
	// systemEventsChannel.emit(SystemEvents.ORIENTATION_CHANGE, window.screen.orientation.angle === 0);
	_orientationQueue.forEach((cb) => cb(_curLayout));
});

!CC_EDITOR &&
	window.addEventListener("resize", function () {
		// const windowOfffsets = casino.viewport.getViewportOffsets();
		// gameDiv.style.top = `${windowOfffsets.topOffset}px`;
		// gameDiv.style.left = `${windowOfffsets.leftOffset}px`;
		// gameDiv.style.right = `${windowOfffsets.rightOffset}px`;
		// gameDiv.style.bottom = `${windowOfffsets.bottomOffset}px`;
		// let width = window.innerWidth - (windowOfffsets.leftOffset + windowOfffsets.rightOffset);
		// let height = window.innerHeight - (windowOfffsets.bottomOffset + windowOfffsets.topOffset);
		let width = window.innerWidth;
		let height = window.innerHeight;
		//cc.view.setFrameSize(width, height);
		const aspectRatio = width / height;
		let layout: Layout;
		if (aspectRatio <= portraitRatio) {
			layout = Layout.PORTRAIT;
		} else if (aspectRatio > portraitRatio && aspectRatio <= landscapeRatio) {
			layout = Layout.DESKTOP;
		} else {
			layout = Layout.LANDSCAPE;
		}
		if (_curLayout !== layout) {
			_curLayout = layout;
			if (_canvas == undefined) {
				_canvas = cc.find("Canvas");
			}
			setFitMode(_canvas.getComponent(cc.Canvas));
			_layoutQueue.forEach((cb) => cb(_curLayout));
			LayoutController.updateLayoutComponents(_curLayout);
		}
		_resizeQueue.forEach((cb) => cb(_curLayout));
	});

function setFitMode(canvas: cc.Canvas) {
	if (_curLayout == Layout.LANDSCAPE) {
		canvas.fitWidth = true;
		canvas.fitHeight = false;
	} else {
		canvas.fitHeight = true;
		canvas.fitWidth = false;
	}
}

function addToResizeQ(context, reSizeCb: (layout: Layout) => void, priority: number = 0) {
	_resizeQueue.push(reSizeCb.bind(context));
}

function addToLayoutQ(context, layoutCb: (layout: Layout) => void, priority: number = 0) {
	_layoutQueue.push(layoutCb.bind(context));
}

function addToOrientationQ(context, orientationCb: (layout: Layout) => void, priority: number = 0) {
	_orientationQueue.push(orientationCb.bind(context));
}

export const LayoutManager = { addToResizeQ, addToLayoutQ, addToOrientationQ };
