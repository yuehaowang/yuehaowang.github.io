function BeginningLayer () {
	var self = this;
	LExtends(self, LSprite, []);

	self.v = -1;
	self.A = 50;

	self.bg = new LBitmap(new LBitmapData(dataList["bg"]));
	self.bg.y = self.bg.y0 = -self.A;
	self.addChild(self.bg);

	self.logoBmp = new LBitmap(new LBitmapData(dataList["logo"]));
	self.logoBmp.x = (LGlobal.width - self.logoBmp.getWidth()) / 2;
	self.logoBmp.y = 80;
	self.addChild(self.logoBmp);

	self.startBtn = null;

	self.createStartBtn();

	self.addEventListener(LEvent.ENTER_FRAME, self.update);
}

BeginningLayer.prototype.createStartBtn = function () {
	var self = this, r = 80;

	self.startBtn = new RoundButton("Go", r, 70);
	self.startBtn.x = (LGlobal.width - r * 2) / 2;
	self.startBtn.y = 430;
	self.addChild(self.startBtn);

	self.startBtn.addEventListener(LMouseEvent.MOUSE_UP, function () {
		self.destroy();
	});
};

BeginningLayer.prototype.update = function (e) {
	var self = e.currentTarget;

	self.bg.x += self.v;
	self.bg.y = self.bg.y0 + self.A * Math.sin(self.bg.x / 50);

	if (self.bg.x >= 0 || self.bg.x <= LGlobal.width - self.bg.getWidth()) {
		self.v *= -1;
	}
};

BeginningLayer.prototype.destroy = function () {
	var self = this;

	self.mouseChildren = false;

	LTweenLite.to(self.logoBmp, 0.4, {
		x : -self.logoBmp.getWidth(),
		ease : LEasing.Quart.easeOut,
		onComplete : function () {
			self.logoBmp.remove();
		}
	});

	LTweenLite.to(self.startBtn, 0.4, {
		x : LGlobal.width,
		ease : LEasing.Quart.easeOut,
		onComplete : function () {
			self.startBtn.remove();
		}
	});

	sceneTransition(function () {
		self.remove();

		delete self.bg;

		startGame();
	});
};