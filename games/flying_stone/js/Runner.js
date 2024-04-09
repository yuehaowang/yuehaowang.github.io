function Runner () {
	var self = this;
	LExtends(self, LSprite, []);

	self.r = 100;
	self.w = Runner.NORMAL_ROTATING_SPEED;
	self.x = LGlobal.width / 2;
	self.y = LGlobal.height - self.r - 80;

	self.runningLayer = new LSprite();
	self.runningLayer.graphics.drawArc(8, "#AA6633", [0, 0, 30, 0, Math.PI * 2], true, "#AAAA33");
	self.runningLayer.graphics.drawRoundRect(0, "", [0, 0, self.r, 12, 5], true, "#AA6633");
	self.addChild(self.runningLayer);

	self.currentStone = new Stone();
	self.currentStone.x = self.r;
	self.currentStone.y = 6;
	self.runningLayer.addChild(self.currentStone);

	self.updateStone();
}

Runner.NORMAL_ROTATING_SPEED = 360;

Runner.prototype.updateStone = function () {
	var self = this, rand = Math.random();

	if (rand < 0.5) {
		self.currentStone.updateStyle(Stone.STYLE1);
	} else {
		self.currentStone.updateStyle(Stone.STYLE2);
	}
};

Runner.prototype.update = function () {
	var self = this, angle = self.runningLayer.rotate + self.w * (LGlobal.speed / 1000);

	self.runningLayer.rotate = angle % 360;
};