(function () {
	if (LGlobal.mobile) {
		LGlobal.aspectRatio = LANDSCAPE;
		LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
		LGlobal.screen(LGlobal.FULL_SCREEN);
	}
})();

LInit(30, "mygame", 800, 480, main);

var dataList = {};

function main () {
	if (LGlobal.mobile) {
		var body = document.body;
		body.style.margin = "0px";
		body.style.background = "black";

		LGlobal.stage.addEventListener(LEvent.WINDOW_RESIZE, function () {
			LGlobal.screen(LGlobal.FULL_SCREEN);
		});
	}

	loadRes();
}

function loadRes () {
	var loadList = [
		{path : "./js/BeginningLayer.js"},
		{path : "./js/SceneLayer.js"},
		{path : "./js/PlayerLayer.js"},
		{path : "./js/ObstacleLayer.js"},
		{path : "./js/HelpLayer.js"},
		{path : "./js/PauseButton.js"},
		{name : "obs1", path : "./images/obs1.png"},
		{name : "obs2", path : "./images/obs2.png"},
		{name : "obs3", path : "./images/obs3.png"},
		{name : "obs4", path : "./images/obs4.png"},
		{name : "pause", path : "./images/pause.png"},
		{name : "play", path : "./images/play.png"},
		{name : "help", path : "./images/help.png"},
		{name : "hand", path : "./images/hand.png"},
		{name : "player", path : "./images/player.png"}
	];

	var loadBar = new LoadBar(loadList.length);
	addChild(loadBar);

	LLoadManage.load(
		loadList,
		function (p) {
			loadBar.setProgress(p);
		},
		function (r) {
			loadBar.remove();

			dataList = r;

			addBeginningLayer();
		}
	);
}

function addBeginningLayer () {
	var beginningLayer = new BeginningLayer();
	addChild(beginningLayer);
}

function addSceneLayer () {
	var sceneLayer = new SceneLayer();
	addChild(sceneLayer);
}

function addHelpLayer (pauseBtn) {
	var helpLayer = new HelpLayer(pauseBtn);
	addChild(helpLayer);
}