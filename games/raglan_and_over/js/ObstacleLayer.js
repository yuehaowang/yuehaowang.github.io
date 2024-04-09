function ObstacleLayer () {
	var s = this;
	LExtends(s, LSprite, []);

	s.hasTypeList = [ObstacleLayer.TYPE_RED_TRIANGLE];
	s.createSpeed = 20;
	s.createSpeedIndex = 0;
	s.isIgnoreHitRT = false;
	s.ignoreTime = 150;
	s.ignoreTimeIndex = s.ignoreTime;
	s.pauseCreate = false;
	s.pause = false;

	s.addEventListener(LEvent.ENTER_FRAME, s.loop);
}

ObstacleLayer.PROBABILITY_GREEN_CIRCLE = [15, 40];
ObstacleLayer.PROBABILITY_BLUE_TRIANGLE = [10, 15];
ObstacleLayer.PROBABILITY_YELLOW_CIRCLE = [0, 5];

ObstacleLayer.TYPE_RED_TRIANGLE = 1;
ObstacleLayer.TYPE_GREEN_CIRCLE = 2;
ObstacleLayer.TYPE_BLUE_TRIANGLE = 3;
ObstacleLayer.TYPE_YELLOW_CIRCLE = 4;

ObstacleLayer.SPEED_RED_TRIANGLE = 5;
ObstacleLayer.SPEED_GREEN_CIRCLE = 3;
ObstacleLayer.SPEED_BLUE_TRIANGLE = 5;
ObstacleLayer.SPEED_YELLOW_CIRCLE = 8;

ObstacleLayer.EVENT_HIT = "hit";
ObstacleLayer.EVENT_DISAPPEAR = "disappear";

ObstacleLayer.prototype.loop = function (e) {
	var s = e.currentTarget;

	if (s.pause) {
		return;
	}

	for (var i = 0; i < s.numChildren; i++) {
		var o = s.getChildAt(i);

		if (!o) {
			continue;
		}

		o.x += o.moveSpeed;

		s.hitTest(o);

		if (o.x > LGlobal.width) {
			o.remove();

			s.dispatchEvent(ObstacleLayer.EVENT_DISAPPEAR);
		}
	}

	if (s.isIgnoreHitRT && ++s.ignoreTimeIndex > s.ignoreTime && s.parent && s.parent.playerLayer) {
		var p = s.parent.playerLayer;

		s.isIgnoreHitRT = false;

		p.ignoreOverBlinkTween = LTweenLite.to(p, 0.7, {
			alpha : 0.9
		}).to(p, 0.7, {
			alpha : 0.2
		}).to(p, 0.7, {
			alpha : 0.9
		}).to(p, 0.7, {
			alpha : 0.2
		}).to(p, 0.7, {
			alpha : 1,
			onComplete : function (o) {
				o.alpha = 1;

				p.ignoreOverBlinkTween = null;
			}
		});
	}

	if (s.pauseCreate || ++s.createSpeedIndex < s.createSpeed) {
		return;
	}

	s.createSpeedIndex = 0;

	s.createObstacle(s.getAType());
};

ObstacleLayer.prototype.hitTest = function (o) {
	var s = this, anotherObj = s.parent ? s.parent.playerLayer : null;

	if (!anotherObj || (o.identity == ObstacleLayer.TYPE_RED_TRIANGLE && anotherObj.alpha < 1)) {
		return;
	}

	for (var i = 0; i < anotherObj.numChildren; i++) {
		var child = anotherObj.getChildAt(i);

		if (!child ) {
			continue;
		}

		if (o.hitTestObject(child)) {
			var e = new LEvent(ObstacleLayer.EVENT_HIT);
			e.currentTarget = o;

			s.dispatchEvent(e);
		}
	}
};

ObstacleLayer.prototype.createObstacle = function (t) {
	var s = this;

	var obs = new LSprite();
	var bmp = new LBitmap(new LBitmapData(dataList["obs" + t]));
	obs.addChild(bmp);
	obs.identity = t;
	obs.x = -obs.getWidth();
	obs.y = 20 + Math.round(Math.random() * (LGlobal.height - 20 - obs.getHeight()));
	s.addChild(obs);

	if (t == ObstacleLayer.TYPE_RED_TRIANGLE) {
		obs.moveSpeed = ObstacleLayer.SPEED_RED_TRIANGLE;
		obs.addShape(LShape.VERTICES, [[5, 0], [40, 10], [5, 20]]);
	} else if (t == ObstacleLayer.TYPE_GREEN_CIRCLE) {
		obs.moveSpeed = ObstacleLayer.SPEED_GREEN_CIRCLE;
		obs.addShape(LShape.ARC, [15, 10, 10]);
	} else if (t == ObstacleLayer.TYPE_BLUE_TRIANGLE) {
		obs.moveSpeed = ObstacleLayer.SPEED_BLUE_TRIANGLE;
		obs.addShape(LShape.VERTICES, [[5, 0], [22, 10], [5, 20]]);
	} else if (t == ObstacleLayer.TYPE_YELLOW_CIRCLE) {
		obs.moveSpeed = ObstacleLayer.SPEED_YELLOW_CIRCLE;
		obs.addShape(LShape.ARC, [20, 15, 15]);
	}
};

ObstacleLayer.prototype.getAType = function () {
	var s = this, n = Math.round(Math.random() * 100),
	pyc = ObstacleLayer.PROBABILITY_YELLOW_CIRCLE,
	pbt = ObstacleLayer.PROBABILITY_BLUE_TRIANGLE,
	pgc = ObstacleLayer.PROBABILITY_GREEN_CIRCLE;

	if (pyc[0] <= n && n < pyc[1] && s.hasType(ObstacleLayer.TYPE_YELLOW_CIRCLE)) {
		return ObstacleLayer.TYPE_YELLOW_CIRCLE;
	} else if (pbt[0] <= n && n < pbt[1] && s.hasType(ObstacleLayer.TYPE_BLUE_TRIANGLE)) {
		return ObstacleLayer.TYPE_BLUE_TRIANGLE;
	} else if (pgc[0] <= n && n<= pgc[1] && s.hasType(ObstacleLayer.TYPE_GREEN_CIRCLE)) {
		return ObstacleLayer.TYPE_GREEN_CIRCLE;
	} else {
		return ObstacleLayer.TYPE_RED_TRIANGLE;
	}
};

ObstacleLayer.prototype.hasType = function (t) {
	var list = this.hasTypeList;

	for (var i = 0, l = list.length; i < l; i++) {
		if (list[i] == t) {
			return true;
		}
	}

	return false;
};

ObstacleLayer.prototype.ignoreHitRT = function () {
	var s = this, p;

	s.ignoreTimeIndex = 0;
	s.isIgnoreHitRT = true;

	if (s.parent && s.parent.playerLayer) {
		 p = s.parent.playerLayer;

		 if (p.ignoreOverBlinkTween && p.alpha < 1) {
		 	LTweenLite.remove(p.ignoreOverBlinkTween);

		 	p.ignoreOverBlinkTween = null;
		 }

		p.alpha = 0.3;
	}
};