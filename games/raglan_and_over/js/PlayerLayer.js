function PlayerLayer () {
	var s = this;
	LExtends(s, LSprite, []);

	s.dir = PlayerLayer.DIR_NONE;
	s.waitingForAdding = null;
	s.pause = false;
	s.continuousStep = 0;
	s.stopMovingTimestamp = null;
	s.ignoreOverBlinkTween = null;

	s.addEventListener(LEvent.ENTER_FRAME, s.loop);
}

PlayerLayer.DIR_NONE = "none";
PlayerLayer.DIR_UP = "up";
PlayerLayer.DIR_DOWN = "down";

PlayerLayer.EVENT_CREATE_PLAYER = "create_player";
PlayerLayer.EVENT_HAS_CREATED_PLAYER = "has_created";
PlayerLayer.EVENT_ADD_ADDITIONAL_SCORE = "add_additional_score";

PlayerLayer.prototype.createPlayer = function (x, y) {
	var s = this;

	var p = new LSprite();
	p.x = x;
	p.y = y;
	p.alpha = 0;
	var bmp = new LBitmap(new LBitmapData(dataList["player"]));
	bmp.x = -bmp.getWidth() / 2;
	bmp.y = -bmp.getHeight() / 2;
	p.addChild(bmp);
	p.addShape(LShape.RECT, [bmp.x, bmp.y, bmp.getWidth(), bmp.getHeight()]);
	
	if (s.parent && s.parent.obstacleLayer && !s.parent.obstacleLayer.numChildren) {
		s.addChild(p);
		s.blinkPlayer(p);
	} else {
		s.waitingForAdding = p;
	}

	s.dispatchEvent(PlayerLayer.EVENT_CREATE_PLAYER);
};

PlayerLayer.prototype.blinkPlayer = function (p) {
	var s = this;

	LTweenLite.to(p, 0.5, {
		alpha : 0.5
	}).to(p, 0.5, {
		alpha : 0.2
	}).to(p, 0.5, {
		alpha : 0.5
	}).to(p, 0.5, {
		alpha : 0.2
	}).to(p, 0.5, {
		alpha : 1,
		onComplete : function (o) {
			s.dispatchEvent(PlayerLayer.EVENT_HAS_CREATED_PLAYER);
		}
	});
};

PlayerLayer.prototype.loop = function (e) {
	var s = e.currentTarget, step = 10, angle = 15, is = 0;

	if (s.pause) {
		return;
	}

	if (s.parent && s.parent.continuousStepTxt) {
		s.parent.continuousStepTxt.text = "C.S. " + s.continuousStep;
	}

	if (s.waitingForAdding && s.parent && s.parent.obstacleLayer && !s.parent.obstacleLayer.numChildren) {
		s.addChild(s.waitingForAdding);

		s.blinkPlayer(s.waitingForAdding);

		s.waitingForAdding = null;
	}


	if (s.dir == PlayerLayer.DIR_NONE) {
		if (s.stopMovingTimestamp && (new Date()).getTime() - s.stopMovingTimestamp > 500) {
			s.continuousStep = 0;
		}

		return;
	} else if (s.dir == PlayerLayer.DIR_UP) {
		step *= -1;
		angle *= -1;
	}

	for (var i = 0; i < s.numChildren; i++) {
		var o = s.getChildAt(i);

		if (!o) {
			continue;
		}

		o.y += step;
		o.rotate += angle;

		if (o.y < 0) {
			o.y = LGlobal.height;
		}

		if (o.y > LGlobal.height) {
			o.y = 0;
		}
	}

	s.continuousStep++;

	if (s.continuousStep == 4000) {
		is = 1500;
	} else if (s.continuousStep == 3000) {
		is = 1000;
	} else if (s.continuousStep == 2000) {
		is = 400;
	} else if (s.continuousStep == 1500) {
		is = 200;
	} else if (s.continuousStep == 1500) {
		is = 200;
	} else if (s.continuousStep == 1000) {
		is = 120;
	} else if (s.continuousStep == 800) {
		is = 80;
	} else if (s.continuousStep == 600) {
		is = 50;
	} else if (s.continuousStep == 400) {
		is = 30;
	} else if (s.continuousStep == 300) {
		is = 20;
	} else if (s.continuousStep == 200) {
		is = 10;
	}

	if (is > 0) {
		var e = new LEvent(PlayerLayer.EVENT_ADD_ADDITIONAL_SCORE);
		e.score = is;

		s.dispatchEvent(e);
	}
};

PlayerLayer.prototype.reducePlayer = function () {
	var s = this, nc = s.numChildren;

	if (nc < 2) {
		return;
	}

	s.getChildAt(nc - 1).remove();
};

PlayerLayer.prototype.randomAddPlayer = function () {
	var s = this, n = Math.floor(Math.random() * 100);

	if (n < 50 && s.numChildren < 2) {
		s.createPlayer(
			LGlobal.width * 0.4 + Math.floor(LGlobal.width * 0.5 * Math.random()),
			LGlobal.height * 0.3 + Math.floor(LGlobal.height * 0.4 * Math.random())
		);
	}
};