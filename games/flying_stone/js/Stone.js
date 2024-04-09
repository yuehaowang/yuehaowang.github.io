function Stone () {
	var self = this;
	LExtends(self, LSprite, []);

	self.bmpW = self.bmpH = 40;

	/** Initial angle */
	self.angle = 0;
	/** Initial speed */
	self.v0 = Stone.v0;
	/** Used time */
	self.t = 0;
	/** Gravity acceleration */
	self.g = 10;
	/** Initial speed of x-axis */
	self.vx0 = 0;
	/** Initial speed of y-axis */
	self.vy0 = 0;

	self.koCount = 0;

	self.currentStyle = null;

	self.bmp = new LBitmap();
	self.bmp.x = -self.bmpW / 2;
	self.bmp.y = -self.bmpH / 2;
	self.addChild(self.bmp);

	self.addShape(LShape.ARC, [0, 0, self.bmpW / 2]);
}

Stone.STYLE1 = 0;
Stone.STYLE2 = 1;

Stone.NORMAL_V0 = 12;
Stone.v0 = Stone.NORMAL_V0;

Stone.NORMAL_NUM_LIMIT = 2;
Stone.numLimit = Stone.NORMAL_NUM_LIMIT;

Stone.prototype.setAngle = function (angle) {
	var self = this;

	self.angle = angle;
	self.vx0 = -Math.sin(self.angle) * self.v0;
	self.vy0 = Math.cos(self.angle) * self.v0;
};

Stone.prototype.update = function () {
	var self = this, gameLayer = self.getParentByConstructor(GameLayer);

	self.t += LGlobal.speed / 1000;

	var vx = self.vx0,
		vy = self.vy0 + self.t * self.g;

	self.x += vx;
	self.y += vy;

	if (
		self.x + self.bmpW / 2 <= 0
		|| self.x - self.bmpW >= LGlobal.width
		|| self.y - self.bmpH / 2 >= LGlobal.height
	) {
		self.remove();
	}

	if (gameLayer) {
		var birdLayer = gameLayer.birdLayer;

		if (!birdLayer) {
			return;
		}

		for (var i = 0, l = birdLayer.numChildren; i < l; i++) {
			var bird = birdLayer.getChildAt(i);

			if (!bird) {
				continue;
			}

			if (bird.hitTestObject(self)) {
				gameLayer.continuousKill(++self.koCount);

				bird.goDead(gameLayer);

				l--;
				i--;
			}
		}
	}
};

Stone.prototype.updateStyle = function (style) {
	var self = this;

	if (style == null) {
		return;
	}

	self.currentStyle = style;

	self.bmp.bitmapData = new LBitmapData(dataList["stone"], style * self.bmpW, 0, self.bmpW, self.bmpH);
};

Stone.prototype.clone = function () {
	var self = this;

	var cloneObj = new Stone();
	cloneObj.updateStyle(self.currentStyle);

	return cloneObj;
};