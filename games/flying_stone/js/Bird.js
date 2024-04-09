function Bird () {
	var self = this;
	LExtends(self, LSprite, []);

	/** Equilibrium position, [120, 240] */
	self.y0 = 0;
	/** Speed of x-axis, [-4, -2] */
	self.v = 0;
	/** Amplitude, [40, 120] */
	self.A = 0;
	/** Period, [0.8, 2.8] */
	self.T = 0;
	/** Used time */
	self.t = 0;

	self.reward = null;

	self.bmp = null;
	self.bmpW = 34;
	self.bmpH = 24;

	self.animaPlayDir = 1;
	self.animaIndex = 0;
	self.animaSpeed = 5;
	self.animaSpeedIndex = self.animaSpeed;

	self.addShape(LShape.ARC, [0, 0, self.bmpW / 2]);

	self.getRandomOrbit();
	self.getReward();
	self.getImage();
}

Bird.prototype.getRandomOrbit = function () {
	var self = this,
		minY = 100,
		amplitude = 40 + Math.floor(Math.random() * 80),
		offsetY = Math.floor(Math.random() * 40);

	self.A = amplitude;
	self.T = 0.8 + Math.random() * 2;

	self.x = LGlobal.width;
	self.y = self.y0 = minY + amplitude + offsetY;
	self.v = -(2 + Math.random() * 2);
};

Bird.prototype.getReward = function () {
	var self = this, val = self.A * 2 / (((self.T * 1000) / LGlobal.speed) * -self.v);

	if (val <= 0.6) {
		self.reward = 1;
	} else if (val <= 0.95) {
		self.reward = 2;
	} else {
		self.reward = 3;
	}

	if (self.y0 <= 160) {
		self.reward += 1;
	}
};

Bird.prototype.getImage = function () {
	var self = this, bmpd;

	if (self.reward <= 1) {
		bmpd = new LBitmapData(dataList["bird1"], 0, 0, self.bmpW, self.bmpH);
	} else if (self.reward <= 2) {
		bmpd = new LBitmapData(dataList["bird2"], 0, 0, self.bmpW, self.bmpH);
	} else {
		bmpd = new LBitmapData(dataList["bird3"], 0, 0, self.bmpW, self.bmpH);
	}

	self.bmp = new LBitmap(bmpd);
	self.bmp.x = -self.bmpW / 2;
	self.bmp.y = -self.bmpH / 2;
	self.addChild(self.bmp);
};

Bird.prototype.update = function () {
	var self = this, progress;

	self.t += LGlobal.speed / 1000;

	progress = (self.t / self.T) * Math.PI * 2;

	self.x += self.v;
	self.y = self.y0 + self.A * Math.sin(progress);
	self.rotate = -Math.atan(Math.cos(progress)) / Math.PI * 180;

	if (self.x + self.bmpW / 2 <= 0) {
		self.remove();
	}

	if (self.animaSpeedIndex++ >= self.animaSpeed) {
		self.animaSpeedIndex = 0;

		self.bmp.bitmapData.setCoordinate(self.animaIndex * self.bmpW, 0);

		self.animaIndex += self.animaPlayDir;

		if (
			self.animaIndex >= 2 && self.animaPlayDir > 0
			|| self.animaIndex <= 0 && self.animaPlayDir < 0
		) {
			self.animaPlayDir *= -1;
		}
	}
};

Bird.prototype.goDead = function (gameLayer) {
	var self = this;

	if (!gameLayer) {
		return;
	}

	var explosion = new Explosion();
	explosion.x = self.x;
	explosion.y = self.y;
	gameLayer.effectLayer.addChild(explosion);

	gameLayer.addPoint(self.reward);

	self.remove();
};