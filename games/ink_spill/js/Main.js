window.onload = function () {
	var w = 414, h = 736;

	if (LGlobal.mobile) {
		h = w * (window.innerHeight / window.innerWidth);

		LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
	}

	LGlobal.screen(LGlobal.FULL_SCREEN);

	LInit(requestAnimationFrame, "mygame", w, h, main);
};

var stageLayer;

function main () {
	LMouseEventContainer.set(LMouseEvent.MOUSE_DOWN, true);
	LMouseEventContainer.set(LMouseEvent.MOUSE_UP, true);
	LMouseEventContainer.set(LMouseEvent.MOUSE_MOVE, true);

	stageLayer = new LSprite();
	addChild(stageLayer);

	// var fps = new FPS();
	// addChild(fps);

	loadRes();
}

function loadRes () {
	var loadList = [
		{path : "./js/Block.js"},
		{path : "./js/HomePageLayer.js"},
		{path : "./js/ColorfulBorder.js"},
		{path : "./js/GameLayer.js"},
		{path : "./js/CountdownTimer.js"},
		{path : "./js/MenuButton.js"},
		{path : "./js/RoundButton.js"},
		{path : "./js/BlockLayer.js"},
		{path : "./js/SelectorLayer.js"},
		{path : "./js/PauseLayer.js"},
		{path : "./js/ResultLayer.js"}
	];

	var loadingBar = new LoadingBar();
	stageLayer.addChild(loadingBar);

	LLoadManage.load(
		loadList,
		null,
		function (result) {
			loadingBar.remove();

			addHomePage();
		}
	);
}

function addHomePage () {
	var homeLayer = new HomePageLayer();
	stageLayer.addChild(homeLayer);
}

function newGame () {
	var gameLayer = new GameLayer(6, 6, 10);
	stageLayer.addChild(gameLayer);
}

function addGameResult (rate, usedTime) {
	var resultLayer = new ResultLayer(rate, usedTime);
	stageLayer.addChild(resultLayer);
}