LInit(1000 / 60, "myapp", 414, 736, main);

var DRAW_SCALE = 30, TIME_SCALE = 1000;

var stageLayer, ctrlLayer, demoLayer;
var w1 = null, w2 = null;
var isStop = true;

function main () {
	if (LGlobal.mobile) {
		LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
	}

	LGlobal.screen(LGlobal.FULL_SCREEN);

	stageLayer = new LSprite();
	addChild(stageLayer);

	var loadingTxt = new LTextField();
	loadingTxt.text = "Loading...";
	loadingTxt.size = 22;
	loadingTxt.textAlign = "center";
	loadingTxt.x = LGlobal.width / 2;
	loadingTxt.y = 300;
	stageLayer.addChild(loadingTxt);

	var loadList = [
		{path : "./js/Wave.js"},
		{path : "./js/Oscillator.js"},
		{path : "./js/Panel.js"},
		{path : "./js/TabWidget.js"},
		{path : "./js/ControlLayer.js"},
		{path : "./js/HelpDialog.js"},
	];

	LLoadManage.load(loadList, null, function () {
		loadingTxt.remove();

		addLayers();
	});
}

function addLayers () {
	demoLayer = new LSprite();
	demoLayer.x = 15;
	demoLayer.y = 150;
	stageLayer.addChild(demoLayer);

	demoLayer.graphics.add(function () {
		var c = LGlobal.canvas;

		c.textAlign = "center";
		c.font = "20px Arial";
		c.fillText("Click the 'Start' button to start demo.", LGlobal.width / 2, 30);
	});

	ctrlLayer = new ControlLayer();
	ctrlLayer.x = 20;
	ctrlLayer.y = 330;
	stageLayer.addChild(ctrlLayer);

	stageLayer.addEventListener(LEvent.ENTER_FRAME, onFrame);
}

function addTwoWaves (w1Data, w2Data) {
	var timer;

	w1 = new Wave(w1Data);
	if (w1Data[3] > 0) {
		timer = new LTimer(w1Data[3] * 1000, 1);
		timer.addEventListener(LTimerEvent.TIMER_COMPLETE, function () {
			w1.start();
		});
		timer.start();
	} else {
		w1.start();
	}

	w2 = new Wave(w2Data);
	if (w2Data[3] > 0) {
		timer = new LTimer(w2Data[3] * 1000, 1);
		timer.addEventListener(LTimerEvent.TIMER_COMPLETE, function () {
			w2.start();
		});
		timer.start();
	} else {
		w2.start();
	}
}

function onFrame () {
	if (isStop || !w1 || !w2) {
		return;
	}

	w1.loop();
	w2.loop();

	demoLayer.graphics.clear();

	var list = Wave.getNewWaveOscillators(w1, w2);

	for (var i = 0, preOsc = null, l = list.length; i < l; i++) {
		var o = list[i];

		if (preOsc) {
			demoLayer.graphics.drawLine(5, "red", [preOsc.x * DRAW_SCALE, preOsc.y * DRAW_SCALE, o.x * DRAW_SCALE, o.y * DRAW_SCALE]);
		}

		preOsc = o;
	}
}