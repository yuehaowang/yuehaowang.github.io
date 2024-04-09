function ControlLayer () {
	var s = this;
	LExtends(s, LSprite, []);

	s.rightPanel = null;
	s.leftPanel = null;

	s.init();
}

ControlLayer.prototype.init = function () {
	var s = this;

	var leftPanelDefs = [0.5, 0.5, 0.5, 0, 1, 1, 0],
		rightPanelDefs = [0.5, 0.5, 0.5, 0, -1, 1, 0];

	s.panel1 = new Panel("Wave 1");
	s.panel1.setAll(leftPanelDefs);

	s.panel2 = new Panel("Wave 2");
	s.panel2.setAll(rightPanelDefs);

	var tabWidget = new TabWidget([
		{
			title : "Wave 1",
			content : s.panel1
		},
		{
			title : "Wave 2",
			content : s.panel2
		}
	]);
	s.addChild(tabWidget);

	var helpBtn = new LButtonSample1("?", 20);
	helpBtn.y = 320;
	s.addChild(helpBtn);

	helpBtn.addEventListener(LMouseEvent.MOUSE_UP, function () {
		HelpDialog.show();
	});

	var startBtn = new LButtonSample1("Start", 20);
	startBtn.x = LGlobal.width - 200;
	startBtn.y = 320;
	s.addChild(startBtn);

	startBtn.addEventListener(LMouseEvent.MOUSE_UP, function () {
		isStop = false;

		var w1Data = s.panel1.getAll(),
			w2Data = s.panel2.getAll();

		addTwoWaves(w1Data, w2Data);
	});

	var stopBtn = new LButtonSample1("Stop", 20);
	stopBtn.x = LGlobal.width - 120;
	stopBtn.y = 320;
	s.addChild(stopBtn);

	stopBtn.addEventListener(LMouseEvent.MOUSE_UP, function () {
		isStop = true;
	});

	var resetBtn = new LButtonSample1("Reset", 20);
	resetBtn.x = LGlobal.width - 290;
	resetBtn.y = 320;
	s.addChild(resetBtn);

	resetBtn.addEventListener(LMouseEvent.MOUSE_UP, function () {
		s.panel1.setAll(leftPanelDefs);
		s.panel2.setAll(rightPanelDefs);
	});
};