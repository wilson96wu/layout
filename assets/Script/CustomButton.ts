//import GameUtil from "../../util/GameUtil";
const { ccclass, property, inspector, executeInEditMode, menu, help } = cc._decorator;

@ccclass
@executeInEditMode
@menu("i18n:MAIN_MENU.component.ui/Button")
@help("i18n:COMPONENT.help_url.button")
@inspector("packages://silkworm_elements_ext/button/inspector.js")
export default class CustomButton extends cc.Button {
	@property({
		type: cc.AudioClip,
		displayName: "Audio",
		tooltip: CC_DEV && "按钮触发时播放的音频剪辑",
	})
	private audioClip: cc.AudioClip = null;

	@property(cc.Vec3)
	private childOffest: cc.Vec3 = cc.v3(0, 0, 0);

	private btnPressed: boolean = false;

	private btnRect: cc.Rect = null;

	// 这里注意注册和移除监听事件不要放到 onLoad 和 onDestory 里
	// 会导致现已经不显示的按钮, 拦截触摸事件, 导致层级低的按钮, 交互出现异常
	protected onEnable() {
		this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
		this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
		this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
		this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
		super.onEnable();
		if (this.btnPressed) {
			this.subOffset();
		}
		this.btnPressed = false;
	}

	protected onDisable() {
		this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
		this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
		this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
		this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
		super.onDisable();
	}

	private onTouchStart(event: cc.Event.EventTouch) {
		if (!this.interactable || !this.enabledInHierarchy) {
			return;
		}
		this.btnPressed = true;
		this.addOffset();
	}

	private onTouchCancel(event: cc.Event.EventTouch) {
		if (!this.interactable || !this.enabledInHierarchy) {
			return;
		}
		if (this.btnPressed) {
			this.subOffset();
		}
		this.btnPressed = false;
	}

	private onTouchMove(event: cc.Event.EventTouch) {
		if (!this.interactable || !this.enabledInHierarchy) {
			return;
		}
		this.btnRect = this.node.getBoundingBox();
		let pressed = true;
		const nodeVec = this.node.parent.convertToNodeSpaceAR(event.getLocation());
		if (!this.btnRect.contains(nodeVec)) {
			pressed = false;
		}
		if (this.btnPressed && !pressed) {
			this.subOffset();
		}
		if (!this.btnPressed && pressed) {
			this.addOffset();
		}
		this.btnPressed = pressed;
	}

	private onTouchEnd(event: cc.Event.EventTouch) {
		if (!this.interactable || !this.enabledInHierarchy) {
			return;
		}
		if (this.btnPressed) {
			//this.audioClip && GameUtil.getInstance().playEffect(this.audioClip);
			this.subOffset();
		}
		this.btnPressed = false;
	}

	private addOffset() {
		if (this.transition !== cc.Button.Transition.SPRITE) {
			return;
		}
		if (this.childOffest.equals(cc.Vec3.ZERO)) {
			return;
		}
		for (const child of this.node.children) {
			child.position = child.position.add(this.childOffest);
		}
	}

	private subOffset() {
		if (this.transition !== cc.Button.Transition.SPRITE) {
			return;
		}
		if (this.childOffest.equals(cc.Vec3.ZERO)) {
			return;
		}
		for (const child of this.node.children) {
			child.position = child.position.sub(this.childOffest);
		}
	}
}
