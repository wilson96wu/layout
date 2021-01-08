//import { Layout } from "./layout.manager";
import LayoutCollectorComponent from "./layoutCollector.component";

const { ccclass, property, executeInEditMode, disallowMultiple } = cc._decorator;
export enum Layout {
	LANDSCAPE,
	DESKTOP,
	PORTRAIT,
}
interface ILayoutComponentConfig {
	name: string;
	class: (new () => any) | string;
	props: string[];
	callback?: (instance: cc.Component) => any;
}

const collectors: LayoutCollectorComponent[] = [];

@ccclass
@executeInEditMode
@disallowMultiple
export class LayoutController extends cc.Component {
	static defaultLayout = 0;
	static Layouts = Layout;
	static LayoutValuesMap: Record<number, number> = (() => {
		const values = {};
		Object.values(Layout).forEach((x) => (values[x] = x));
		return values;
	})();

	static componentsConfig: ILayoutComponentConfig[] = [
		{
			name: "node",
			class: "node",
			props: ["x", "y", "width", "height", "color", "angle", "scaleX", "scaleY", "anchorX", "anchorY", "opacity", "skewX", "skewY"],
		},
		// {
		// 	name: "widget",
		// 	class: cc.Widget,
		// 	props: [
		// 		"isAlignHorizontalCenter",
		// 		"isAlignVerticalCenter",
		// 		"isAlignTop",
		// 		"isAlignLeft",
		// 		"isAlignRight",
		// 		"isAlignBottom",
		// 		"top",
		// 		"bottom",
		// 		"left",
		// 		"right",
		// 	],
		// 	callback: (instance: cc.Widget) => instance.updateAlignment(),
		// },
		// {
		// 	name: "node",
		// 	class: "node",
		// 	props: ["width", "height"],
		// },
		// {
		// 	name: "layout",
		// 	class: cc.Layout,
		// 	props: [
		// 		"type",
		// 		"resizeMode",
		// 		"paddingTop",
		// 		"paddingBottom",
		// 		"paddingLeft",
		// 		"paddingRight",
		// 		"spacingY",
		// 		"spacingX",
		// 		"verticalDirection",
		// 		"horizontalDirection",
		// 		"affectedByScale",
		// 	],
		// },
	];

	@property({ type: cc.Enum(LayoutController.Layouts), serializable: true })
	private _currentLayout = LayoutController.defaultLayout;
	@property({ type: cc.Enum(LayoutController.Layouts) })
	get currentLayout() {
		return this._currentLayout;
	}
	set currentLayout(value) {
		CC_EDITOR && this._saveCurrentLayout();
		this._updateLayout(value);
		this._currentLayout = value;
	}

	@property({ visible: false, serializable: true })
	private _layoutConfig: Record<number, any> = {};

	private componentInstances: { config: ILayoutComponentConfig; instance: cc.Component }[] = [];

	// constructor() {
	// 	super();
	// 	DesignConfigComponent.instances.push(this);
	// }

	addCollector(instance) {
		collectors.push(instance);
		this._getTrackedComponentInstances();
	}

	static updateLayoutComponents(layout: number) {
		if (LayoutController.LayoutValuesMap[layout] != undefined) {
			let instance: LayoutCollectorComponent;
			for (let i = 0; i < collectors.length; ++i) {
				instance = collectors[i];
				if (instance.node) {
					instance.updateLayout(layout);
				}
			}
		}
	}

	onLoad() {
		this._getTrackedComponentInstances();
	}

	private _getTrackedComponentInstances() {
		let config: ILayoutComponentConfig;
		let component: cc.Component;
		for (let i = 0; i < LayoutController.componentsConfig.length; ++i) {
			config = LayoutController.componentsConfig[i];

			if (typeof config.class === "string" && this[config.class]) {
				this.componentInstances.push({ config, instance: this[config.class] });
			} else {
				component = this.getComponent(config.class as new () => any);
				if (component) {
					this.componentInstances.push({ config, instance: component });
				}
			}
		}
	}

	private _saveCurrentLayout() {
		// this._layoutConfig[this.currentLayout] = {};
		// let j: number;
		// let key: string;
		// let componentInstance: typeof LayoutController.prototype.componentInstances[0];
		// for (let i = 0; i < this.componentInstances.length; ++i) {
		// 	componentInstance = this.componentInstances[i];
		// 	this._layoutConfig[this.currentLayout][componentInstance.config.name] =
		// 		this._layoutConfig[this.currentLayout][componentInstance.config.name] || {};
		// 	for (j = 0; j < componentInstance.config.props.length; ++j) {
		// 		key = componentInstance.config.props[j];
		// 		// Save current node values in previous layout
		// 		this._layoutConfig[this.currentLayout][componentInstance.config.name][key] = componentInstance.instance[key].clone
		// 			? componentInstance.instance[key].clone()
		// 			: componentInstance.instance[key];
		// 	}
		// }
	}

	private _updateLayout(layout: number) {
		if (layout !== this.currentLayout && this._layoutConfig[layout]) {
			let j: number;
			let key: string;
			let componentInstance: typeof LayoutController.prototype.componentInstances[0];
			for (let i = 0; i < this.componentInstances.length; ++i) {
				componentInstance = this.componentInstances[i];
				if (this._layoutConfig[layout][componentInstance.config.name]) {
					for (j = 0; j < componentInstance.config.props.length; ++j) {
						key = componentInstance.config.props[j];
						componentInstance.instance[key] = this._layoutConfig[layout][componentInstance.config.name][key];
					}
					componentInstance.config.callback && componentInstance.config.callback(componentInstance.instance);
				}
			}
		}
	}
}

if (CC_EDITOR) {
	window["silkworm"] = window["silkworm"] || {};
	window["silkworm"].updateLayout = LayoutController.updateLayoutComponents;
}
