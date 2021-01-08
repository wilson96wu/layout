const { ccclass, property, executeInEditMode, disallowMultiple, inspector } = cc._decorator;

enum Layouts {
	PORTRAIT,
	LANDSCAPE,
	DESKTOP,
}

interface ILayoutComponentConfig {
	name: string;
	class?: (new () => any) | string;
	props: string[];
	callback?: (instance: cc.Component) => any;
}

// TODO: CLEAN UP CODE AND FIX WIDGET ISSUE

@ccclass
@executeInEditMode
@disallowMultiple
@inspector("packages://silkworm_elements_ext/designConfig/designConfig-inspector.js")
export class DesignConfigComponent extends cc.Component {
	static defaultLayout = 0;
	static Layouts = Layouts;
	static LayoutValuesMap: Record<number, number> = (() => {
		const values = {};
		Object.values(DesignConfigComponent.Layouts).forEach((x) => (values[x] = x));
		return values;
	})();

	static componentsConfig: ILayoutComponentConfig[] = [
		{
			name: "layout",
			class: cc.Layout,
			props: [
				"type",
				"resizeMode",
				"paddingTop",
				"paddingBottom",
				"paddingLeft",
				"paddingRight",
				"spacingY",
				"spacingX",
				"verticalDirection",
				"horizontalDirection",
				"affectedByScale",
			],
		},
		{
			name: "node",
			props: ["x", "y", "width", "height", "color", "angle", "scaleX", "scaleY", "anchorX", "anchorY", "opacity", "skewX", "skewY"],
		},
		{
			name: "widget",
			class: cc.Widget,
			props: [
				"isAlignHorizontalCenter",
				"isAlignVerticalCenter",
				"isAlignTop",
				"isAlignLeft",
				"isAlignRight",
				"isAlignBottom",
				"top",
				"bottom",
				"left",
				"right",
			],
			callback: (instance: cc.Widget) => instance.updateAlignment(),
		},
		// {
		// 	name: "node",
		// 	props: ["width", "height"],
		// },
	];
	static instances: DesignConfigComponent[] = [];

	@property({ type: cc.Enum(DesignConfigComponent.Layouts), serializable: true })
	private _currentLayout = DesignConfigComponent.defaultLayout;

	@property({ type: cc.Enum(DesignConfigComponent.Layouts) })
	get currentLayout() {
		return this._currentLayout;
	}
	set currentLayout(value) {
		if (CC_EDITOR) {
			this._layoutConfig[this.currentLayout] = this._layoutConfig[this.currentLayout] || {};
			this._layoutIds = [];
			this._traverseNodeTree(cc.find("Canvas"));
		}
		this._updateNodeConfig(value);
		this._currentLayout = value;
	}

	@property({ visible: false })
	private _layoutConfig: Record<number, Record<string, any>> = {};

	@property(cc.Integer)
	numVisibleSymbols = 3;

	private _layoutIds: string[] = [];
	private _layoutItems: Record<string, { component: string; prop: string; instance: cc.Node }[]> = {};

	constructor() {
		super();
		DesignConfigComponent.instances.push(this);
	}

	static updateLayoutComponents(layout: number) {
		if (DesignConfigComponent.LayoutValuesMap[layout] != undefined) {
			let instance: DesignConfigComponent;
			for (let i = 0; i < DesignConfigComponent.instances.length; ++i) {
				instance = DesignConfigComponent.instances[i];
				if (instance.node) {
					instance.currentLayout = layout;
				}
			}
		}
	}

	start() {
		//cc.log("reset");
		this._getTrackedComponentInstances(cc.find("Canvas"));
		CC_EDITOR && this._layoutConfig[this.currentLayout] && (this._layoutIds = Object.keys(this._layoutConfig[this.currentLayout]));
	}

	private _getTrackedComponentInstances(node: cc.Node) {
		if (node.children.length > 0) {
			for (let i = 0; i < node.children.length; ++i) {
				this._getTrackedComponentInstances(node.children[i]);
			}
		}

		let instance;
		let j: number;
		let componentConfig: ILayoutComponentConfig;
		this._layoutItems[node.uuid] = [];
		for (let i = 0; i < DesignConfigComponent.componentsConfig.length; ++i) {
			componentConfig = DesignConfigComponent.componentsConfig[i];
			instance = componentConfig.class ? node.getComponent(componentConfig.class as any) : node;
			if (instance) {
				for (j = 0; j < componentConfig.props.length; ++j) {
					this._layoutItems[node.uuid].push({ prop: componentConfig.props[j], instance, component: componentConfig.name });
				}
			}
		}
	}

	private _traverseNodeTree(node: cc.Node) {
		const config = { name: node.name };
		this._extractNodeData(node, config);

		this._layoutConfig[this.currentLayout][node.uuid] = config;
		this._layoutIds.push(node.uuid);

		if (node.children.length > 0) {
			for (let i = 0; i < node.children.length; ++i) {
				this._traverseNodeTree(node.children[i]);
			}
		}
	}

	private _extractNodeData(node: cc.Node, config: any) {
		let componentConfig: ILayoutComponentConfig;
		let instance: Record<string, any>;
		let j: number;
		let key: string;
		for (let i = 0; i < DesignConfigComponent.componentsConfig.length; ++i) {
			componentConfig = DesignConfigComponent.componentsConfig[i];

			instance = componentConfig.class ? node.getComponent(componentConfig.class as any) : node;
			if (instance) {
				config[componentConfig.name] = config[componentConfig.name] || {};

				for (j = 0; j < componentConfig.props.length; ++j) {
					key = componentConfig.props[j];
					config[componentConfig.name][key] = instance[key].clone ? instance[key].clone() : instance[key];
				}
			}
		}
	}

	private _updateNodeConfig(layout: Layouts) {
		const config = this._layoutConfig[layout];
		if (config) {
			let key: string;
			let j: number;
			let layoutItems: typeof DesignConfigComponent.prototype._layoutItems[0];
			let layoutItem: typeof layoutItems[0];
			for (let i = 0; i < this._layoutIds.length; ++i) {
				key = this._layoutIds[i];
				layoutItems = this._layoutItems[key];
				if (config[key] && layoutItems) {
					for (j = 0; j < layoutItems.length; ++j) {
						layoutItem = layoutItems[j];
						if (config[key][layoutItem.component]) {
							layoutItem.instance[layoutItem.prop] = config[key][layoutItem.component][layoutItem.prop];
						}
					}
				}
			}
		}
	}
}

if (CC_EDITOR) {
	window["silkworm"] = window["silkworm"] || {};
	window["silkworm"].updateLayout = DesignConfigComponent.updateLayoutComponents;
}
