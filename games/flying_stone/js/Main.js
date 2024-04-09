window._requestAF = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback, element) {
			window.setTimeout(callback, 1000/60);
		};
})();

window.onload = function () {
	var w, h;

	if (LGlobal.mobile) {
		h = 736;
		w = h * window.innerWidth / window.innerHeight;

		LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
	} else {
		w = 414;
		h = 736;
	}

	LGlobal.aspectRatio = PORTRAIT;
	LGlobal.webAudio = true;

	LInit(window._requestAF, "mygame", w, h, main);
};

var dataList = {};
var stageLayer, curtainLayer;

function main () {
	LGlobal.screen(LGlobal.FULL_SCREEN);

	loadRes();
}

function loadRes () {
	var loadData = [
		{path : "./js/RoundButton.js"},
		{path : "./js/BeginningLayer.js"},
		{path : "./js/GameLayer.js"},
		{path : "./js/PauseButton.js"},
		{path : "./js/PauseMenu.js"},
		{path : "./js/Runner.js"},
		{path : "./js/Bird.js"},
		{path : "./js/Stone.js"},
		{path : "./js/Explosion.js"},
		{path : "./js/ShareUtils.js"},
		{path : "./js/ShareBox.js"},

		{name : "bg", path : "./images/bg.png"},
		{name : "btn_pause_sheet", path : "./images/btn_pause_sheet.png"},
		{name : "logo", path : "./images/logo.png"},
		{name : "bird1", path : "./images/bird1.png"},
		{name : "bird2", path : "./images/bird2.png"},
		{name : "bird3", path : "./images/bird3.png"},
		{name : "stone", path : "./images/stone.png"},
		{name : "explosion", path : "./images/explosion.png"},
		{name : "icon_qzone", path : "./images/icon_qzone.png"},
		{name : "icon_weibo", path : "./images/icon_weibo.png"}
	];

	var loadingBar = new SinLoadingBar(loadData.length);
	addChild(loadingBar);

	LLoadManage.load(
		loadData,
		function () {
			loadingBar.setProgress();
		},
		function (res) {
			dataList = res;
			
			var timer = new LTimer(100, 1);
			timer.addEventListener(LTimerEvent.TIMER_COMPLETE, function () {
				loadingBar.remove();

				stageLayer = new LSprite();
				addChild(stageLayer);

				curtainLayer = new LSprite();
				addChild(curtainLayer);

				// var fps = new FPS();
				// addChild(fps);

				addBeginningLayer();
			});
			timer.start();
		}
	);
}

function sceneTransition (callback) {
	var curtainSh = new LShape();
	curtainSh.alpha = 0;
	curtainSh.graphics.drawRect(0, "", [0, 0, LGlobal.width, LGlobal.height], true, "#000000");
	curtainLayer.addChild(curtainSh);

	LTweenLite.to(curtainSh, 0.5, {
		alpha : 1
	}).to(curtainSh, 0.5, {
		delay : 0.5,
		alpha : 0,
		onStart : function () {
			callback();
		},
		onComplete : function () {
			curtainSh.remove();
		}
	});
}

function addBeginningLayer () {
	var beginnningLayer = new BeginningLayer();
	stageLayer.addChild(beginnningLayer);
}

function startGame () {
	var gameLayer = new GameLayer();
	stageLayer.addChild(gameLayer);
}