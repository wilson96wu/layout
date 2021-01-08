"use strict";
let packageName = "silkworm_elements_ext";
let fs = require("fire-fs");
let path = require('fire-path');

let COMPONENTS_CONFIG= [
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
      "affectedByScale"
    ]
  },
  {
    name: "node",
    props: ["x", "y", "width", "height", "color", "angle", "scaleX", "scaleY", "anchorX", "anchorY", "opacity", "skewX", "skewY"]
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
      "right"
    ],
    callback: (instance) => instance.updateAlignment()
  },
  {
    name: "node",
    props: ["width", "height"]
  }
];

let _currentLayout =0;
let _layoutConfig = {};
let _layoutIds = [];

function _traverseNodeTree(node) {
  const config = { name: node.name }; 
  _extractNodeData(node, config);

  _layoutConfig[_currentLayout][node.uuid] = config;
  _layoutIds.push(node.uuid);

  if (node.children.length > 0) {
    for (let i = 0; i < node.children.length; ++i) {
      _traverseNodeTree(node.children[i]);
    }
  }
}

function _extractNodeData(node, config) { 
  let componentConfig;
  let instance;
  let j;
  let key;
  for (let i = 0; i < COMPONENTS_CONFIG.length; ++i) {
    componentConfig = COMPONENTS_CONFIG[i];

    instance = componentConfig.class ? node.getComponent(componentConfig.class) : node;
    if (instance) {
      config[componentConfig.name] = config[componentConfig.name] || {};

      for (j = 0; j < componentConfig.props.length; ++j) {
        key = componentConfig.props[j];
        config[componentConfig.name][key] = instance[key].clone ? instance[key].clone() : instance[key];
      }
    }
  }
}


Vue.component('design-config-inspector', {
    style: fs.readFileSync(Editor.url('packages://' + packageName + '/designConfig/designConfig-inspector.css'), 'utf8') + "",
    template: fs.readFileSync(Editor.url('packages://' + packageName + '/designConfig/designConfig-inspector.html'), 'utf8') + "",
    props: {
        target: {
            twoWay: true,
            type: Object,
        }
    },
    data: ()=>({
      currentLayout:0
    }),
    created() {
      console.log(this.target);
  },
  watch: {
      target() {
          this._update()
      }
  },
    methods: {
      onSelect(val){       
        // console.log(val);     
        // this.target.currentLayout.value =1;      
      },
      onSave(){   
        // const t = { id: this.target.uuid.value, path: "numVisibleSymbols", type: "Number", isSubProp: false, value: 7 };
        // Editor.Ipc.sendToPanel("scene", "scene:set-property", t);

        //this.target.numVisibleSymbols.value = 2;
        console.log(this.target.numVisibleSymbols.value);
        Editor.log(this.target.numVisibleSymbols.value);
        _layoutConfig[this.currentLayout] = _layoutConfig[this.currentLayout] || {};
        _currentLayout = this.currentLayout;
        _traverseNodeTree(cc.find("Canvas"));
        console.log(_layoutConfig[this.currentLayout]);
        const t = { id: this.target.uuid.value, path: "_layoutConfig", isSubProp: false, value: _layoutConfig[this.currentLayout] };
        Editor.Ipc.sendToPanel("scene", "scene:set-property", t);
        //this.target._layoutConfig.value = _layoutConfig[this.currentLayout];
        console.log(this.target);
      }
    }
});