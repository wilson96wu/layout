"use strict";
Vue.component("cc-button", {
template: `
<ui-prop v-prop="target.target" :multi-values="multi">
</ui-prop>
<div class="horizontal layout end-justified" style="padding:5px 0;margin-bottom:5px;">
  <ui-button class="blue tiny" @confirm="resetNodeSize" v-disabled="_checkResizeToTarget(target.target, multi)">
    Resize to Target
  </ui-button>
</div>
<ui-prop v-prop="target.interactable" :multi-values="multi">
  // 扩展触发音效支持
</ui-prop>
<ui-prop indent=1 v-prop="target.audioClip" :multi-values="multi"></ui-prop>
// 扩展按下时支持子节点位置变化
<div v-if="_checkTransition(target.transition, 2, multi)">
  <ui-prop name="childOffest" type="cc.Vec2" step="1" :multi-values="multi" v-value="target.childOffest.value"
    v-values="target.childOffest.values" v-readonly="target.childOffest.readonly"
    tooltip=${Editor.T("custom-component.childOffset")}></ui-prop>

</div>
<ui-prop v-prop="target.enableAutoGrayEffect" v-show="_autoGrayEffectEnabled()" :multi-values="multi"></ui-prop>
<ui-prop v-prop="target.transition" :multi-values="multi"></ui-prop>
<div v-if="_checkTransition(target.transition, 1, multi)">
  <ui-prop indent=1 v-prop="target.normalColor" :multi-values="multi"></ui-prop>
  <ui-prop indent=1 v-prop="target.pressedColor" :multi-values="multi"></ui-prop>
  <ui-prop indent=1 v-prop="target.hoverColor" :multi-values="multi"></ui-prop>
  <ui-prop indent=1 v-prop="target.disabledColor" :multi-values="multi"></ui-prop>
  <ui-prop indent=1 v-prop="target.duration" :multi-values="multi"></ui-prop>
</div>
<div v-if="_checkTransition(target.transition, 2, multi)">
  <ui-prop indent=1 v-prop="target.normalSprite" :multi-values="multi"></ui-prop>
  <ui-prop indent=1 v-prop="target.pressedSprite" :multi-values="multi"></ui-prop>
  <ui-prop indent=1 v-prop="target.hoverSprite" :multi-values="multi"></ui-prop>
  <ui-prop indent=1 v-prop="target.disabledSprite" :multi-values="multi"></ui-prop>
</div>
<div v-if="_checkTransition(target.transition, 3, multi)">
  <ui-prop indent=1 v-prop="target.duration" :multi-values="multi"></ui-prop>
  <ui-prop indent=1 v-prop="target.zoomScale" :multi-values="multi"></ui-prop>
</div>
<cc-array-prop :target.sync="target.clickEvents"></cc-array-prop>
`,
props:
{
    target: { twoWay: !0, type: Object },
    multi: { type: Boolean },
},
methods:
{
    T: Editor.T,
    resetNodeSize() {
        const t = { id: this.target.uuid.value, path: "_resizeToTarget", type: "Boolean", isSubProp: !1, value: !0 };
        Editor.Ipc.sendToPanel("scene", "scene:set-property", t);
    },
    _autoGrayEffectEnabled() {
        return !(1 === this.target.transition.value || 2 === this.target.transition.value && this.target.disabledSprite.value.uuid);
    },
    _checkResizeToTarget: (t, n) => !!n || !t.value.uuid,
    _checkTransition: (t, n, i) => i ? t.values.every(t => t === n) : t.value === n,
},
});