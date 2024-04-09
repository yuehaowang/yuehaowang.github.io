function SceneLayer () {
	var s = this;
	LExtends(s, LSprite, []);

	s.score = 0;
	s.pauseBtn = null;
	s.helpBtn = null;

	var bg = new LShape();
	bg.graphics.drawRect(0, "", [0, 0, LGlobal.width, LGlobal.height], true, "#EDEDED");
	s.addChild(bg);

	s.playerLayer = new PlayerLayer();
	s.addChild(s.playerLayer);

	s.obstacleLayer = new ObstacleLayer();
	s.addChild(s.obstacleLayer);

	s.scoreTxt = new Label(true);
	s.scoreTxt.text = s.score;
	s.scoreTxt.size = 30;
	s.scoreTxt.textAlign = "center";
	s.scoreTxt.textBaseline = "middle";
	s.scoreTxt.x = LGlobal.width / 2;
	s.scoreTxt.y = 30;
	s.addChild(s.scoreTxt);

	s.continuousStepTxt = new Label(true);
	s.continuousStepTxt.size = 30;
	s.continuousStepTxt.textAlign = "right";
	s.continuousStepTxt.textBaseline = "bottom";
	s.continuousStepTxt.x = LGlobal.width - 30;
	s.continuousStepTxt.y = LGlobal.height - 30;
	s.addChild(s.continuousStepTxt);

	s.pauseBtn = new PauseButton();
	s.pauseBtn.x = 20;
	s.pauseBtn.y = 40;
	s.addChild(s.pauseBtn);

	s.createHelpBtn();

	s.playerLayer.addEventListener(PlayerLayer.EVENT_CREATE_PLAYER, function () {
		s.obstacleLayer.pauseCreate = true;
	});
	s.playerLayer.addEventListener(PlayerLayer.EVENT_HAS_CREATED_PLAYER, function () {
		s.obstacleLayer.pauseCreate = false;
	});
	s.playerLayer.addEventListener(PlayerLayer.EVENT_ADD_ADDITIONAL_SCORE, function (e) {
		var is = e.score;

		s.changeScore(s.score += is);

		s.showScoreHint("Additional Score: +" + is, 25, 1);
	});

	s.obstacleLayer.addEventListener(ObstacleLayer.EVENT_DISAPPEAR, function () {
		s.changeScore(++s.score);
	});
	s.obstacleLayer.addEventListener(ObstacleLayer.EVENT_HIT, function (e) {
		s.onHit(e);
	});

	s.addEventListener(LMouseEvent.MOUSE_DOWN, s.onMouseDown);
	s.addEventListener(LMouseEvent.MOUSE_UP, function () {
		s.playerLayer.dir = PlayerLayer.DIR_NONE;
		s.playerLayer.stopMovingTimestamp = (new Date()).getTime();
	});

	if (!LGlobal.mobile) {
		LGlobal.stage.addEventListener(LKeyboardEvent.KEY_DOWN, function (e) {
			s.onKeyDown(e);
		});
		LGlobal.stage.addEventListener(LKeyboardEvent.KEY_UP, function (e) {
			s.playerLayer.dir = PlayerLayer.DIR_NONE;
			s.playerLayer.stopMovingTimestamp = (new Date()).getTime();
		});
	}

	s.playerLayer.createPlayer(500, LGlobal.height / 2);
}

SceneLayer.prototype.createHelpBtn = function () {
	var s = this;

	var bmp = new LBitmap(new LBitmapData(dataList["help"]));
	s.helpBtn = new LSprite();
	s.helpBtn.addChild(bmp);
	s.helpBtn.x = LGlobal.width - s.helpBtn.getWidth() - 15;
	s.helpBtn.y = 30;
	s.addChild(s.helpBtn);

	s.helpBtn.addEventListener(LMouseEvent.MOUSE_UP, function () {
		addHelpLayer(s.pauseBtn);
	});
};

SceneLayer.prototype.onKeyDown = function (e) {
	var s = this, kc = e.keyCode;

	if (kc == 38) {
		s.playerLayer.dir = PlayerLayer.DIR_UP;
	} else if (kc == 40) {
		s.playerLayer.dir = PlayerLayer.DIR_DOWN;
	}
};

SceneLayer.prototype.onMouseDown = function (e) {
	var s = e.currentTarget, sx = e.selfX, sy = e.selfY;

	if (s.pauseBtn.hitTestPoint(sx, sy) || s.helpBtn.hitTestPoint(sx, sy) || s.pause) {
		return;
	}

	if (sy > LGlobal.height / 2) {
		s.playerLayer.dir = PlayerLayer.DIR_DOWN;
	} else {
		s.playerLayer.dir = PlayerLayer.DIR_UP;
	}
};

SceneLayer.prototype.showScoreHint = function (t, size, delay, x, y) {
	var s = this;

	var txt = new Label();
	txt.alpha = 0;
	txt.text = t;
	txt.size = size || 20;
	txt.x = (typeof x == "number") ? x : (LGlobal.width - txt.getWidth()) / 2;
	txt.toY = (typeof y == "number") ? y : (LGlobal.height - txt.getHeight()) / 2;
	txt.y = txt.toY + 30;
	s.addChild(txt);

	LTweenLite.to(txt, 0.5, {
		alpha : 1,
		y : txt.toY
	}).to(txt, 0.5, {
		alpha : 0,
		y : txt.toY - 30,
		delay : (typeof delay == "number") ? delay : 0,
		onComplete : function (o) {
			o.remove();
		}
	});
};

SceneLayer.prototype.onHit = function (e) {
	var s = this, o = e.currentTarget, i = o.identity;

	if (i == ObstacleLayer.TYPE_RED_TRIANGLE) {
		s.gameOver();
	} else if (i == ObstacleLayer.TYPE_GREEN_CIRCLE) {
		s.changeScore(s.score += 10);

		s.showScoreHint("+10", 20, 0, o.x, o.y);

		o.remove();
	} else if (i == ObstacleLayer.TYPE_BLUE_TRIANGLE) {
		s.playerLayer.reducePlayer();

		o.remove();
	} else if (i == ObstacleLayer.TYPE_YELLOW_CIRCLE) {
		s.obstacleLayer.ignoreHitRT();

		o.remove();
	}
};

SceneLayer.prototype.gameOver = function () {
	var s = this,
	hintTxt1 = null,
	hintTxt2 = null,
	d = {
		alpha : 0,
		onComplete : function (o) {
			if (o.type == "LSprite") {
				o.remove();
			}
		}
	};

	hintTxt1 = new Label();
	hintTxt1.text = "Final Score";
	hintTxt1.alpha = 0;
	hintTxt1.textAlign = "center";
	hintTxt1.x = LGlobal.width / 2;
	hintTxt1.y = -50;
	hintTxt1.size = 25;
	s.addChild(hintTxt1);

	hintTxt2 = new Label();
	hintTxt2.text = "Tap to Restart";
	hintTxt2.alpha = 0;
	hintTxt2.textAlign = "center";
	hintTxt2.x = LGlobal.width / 2;
	hintTxt2.y = LGlobal.height + 50;
	hintTxt2.size = 25;
	s.addChild(hintTxt2);

	s.pauseBtn.mouseEnabled = false;
	s.helpBtn.mouseEnabled = false;

	LTweenLite.to(s.playerLayer, 0.5, d).to(s.obstacleLayer, 0.5, d).to(s.pauseBtn, 0.5, d).to(s.helpBtn, 0.5, d).to(s.continuousStepTxt, 0.5, d).to(s.scoreTxt, 1, {
		size : 50,
		y : 220
	}).to(hintTxt1, 1, {
		alpha : 1,
		y : 130,
		ease : Quad.easeOut
	}).to(hintTxt2, 1, {
		alpha : 1,
		y :  270,
		ease : Quad.easeIn,
		onComplete : function () {
			s.addEventListener(LMouseEvent.MOUSE_DOWN, function () {
				s.remove();

				addSceneLayer();
			});
		}
	});

	s.removeAllEventListener();
	s.playerLayer.removeAllEventListener();
	s.obstacleLayer.removeAllEventListener();
};

SceneLayer.prototype.changeScore = function (sc) {
	var s = this;

	s.scoreTxt.text = sc;

	if (sc > 0 && sc % 30 == 0) {
		s.playerLayer. randomAddPlayer();
	}

	if (sc > 40 && !s.obstacleLayer.hasType(ObstacleLayer.TYPE_GREEN_CIRCLE)) {
		s.obstacleLayer.hasTypeList.push(ObstacleLayer.TYPE_GREEN_CIRCLE);
	} 

	if (sc > 100 && !s.obstacleLayer.hasType(ObstacleLayer.TYPE_BLUE_TRIANGLE)) {
		s.obstacleLayer.hasTypeList.push(ObstacleLayer.TYPE_BLUE_TRIANGLE);
	}

	if (sc > 150 && !s.obstacleLayer.hasType(ObstacleLayer.TYPE_YELLOW_CIRCLE)) {
		s.obstacleLayer.hasTypeList.push(ObstacleLayer.TYPE_YELLOW_CIRCLE);
	}
};