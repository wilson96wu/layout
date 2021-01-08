const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {
	@property
	text: string = "hello";

	onLoad() {
		//cc.view.enableRetina(true);
		//cc.view.resizeWithBrowserSize(true);
	}

	start() {
		// init logic
		//this.label.string = this.text;
	}
}
