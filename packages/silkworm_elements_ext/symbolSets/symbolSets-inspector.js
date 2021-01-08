"use strict";
let packageName = "silkworm_elements_ext";
let fs = require("fire-fs");
let path = require('fire-path');


Vue.component('symbol-inspector', {
    style: fs.readFileSync(Editor.url('packages://' + packageName + '/symbolSets/symbolSets-inspector.css'), 'utf8') + "",
    template: fs.readFileSync(Editor.url('packages://' + packageName + '/symbolSets/symbolSets-inspector.html'), 'utf8') + "",
    props: {
        target: {
            twoWay: true,
            type: Object,
        }
    },
    data: ()=>({
    }),
    created() {
      console.log(this.target.numVisibleSymbols);
  },
  watch: {
      target() {
          this._update()
      }
  },
    methods: {
        _update() {
          if (this.target){
            this.target.symbolSets[0].symbols.array.forEach((symbol, i) => {
              symbol.id = i;
            });
          }
      }
    }
});