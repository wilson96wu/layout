//import { LayoutController } from "./layoutController.component";
const { ccclass, property } = cc._decorator;

@ccclass
export default class LayoutCollectorComponent extends cc.Component {
	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		let _canvas = cc.find("Canvas");
		// let designConfigComponent = _canvas.getComponent(LayoutController);
		// designConfigComponent.addCollector(this);
	}

	updateLayout(layout: number) {
		// if (layout !== this.currentLayout && this._layoutConfig[layout]) {
		// 	let j: number;
		// 	let key: string;
		// 	let componentInstance: typeof DesignConfigComponent.prototype.componentInstances[0];
		// 	for (let i = 0; i < this.componentInstances.length; ++i) {
		// 		componentInstance = this.componentInstances[i];
		// 		if (this._layoutConfig[layout][componentInstance.config.name]) {
		// 			for (j = 0; j < componentInstance.config.props.length; ++j) {
		// 				key = componentInstance.config.props[j];
		// 				componentInstance.instance[key] = this._layoutConfig[layout][componentInstance.config.name][key];
		// 			}
		// 			componentInstance.config.callback && componentInstance.config.callback(componentInstance.instance);
		// 		}
		// 	}
		// }
	}

	// update (dt) {}
}
