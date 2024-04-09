function SinLoadingBar (total) {
	var self = this;
	LExtends(self, LSprite, []);

	self.total = total;
	self.loadedIndex = 0;

	self.lastPoint = new LPoint(0, 0);
	self.T = 300;
	self.A = 100;

	self.filters = [new LDropShadowFilter(null, null, "#00FF00")];

	self.paintingLayer = new LShape();
	self.paintingLayer.x = (LGlobal.width - self.T) / 2;
	self.paintingLayer.y = LGlobal.height / 2 - 50;
	self.addChild(self.paintingLayer);

	self.hintTxt = new LTextField();
	self.hintTxt.text = "Loading...";
	self.hintTxt.color = "#00FF00";
	self.hintTxt.size = 30;
	self.hintTxt.weight = "bold";
	self.hintTxt.x = (LGlobal.width - self.hintTxt.getWidth()) / 2;
	self.hintTxt.y = LGlobal.height / 2 + 160;
	self.addChild(self.hintTxt);
}

SinLoadingBar.prototype.setProgress = function () {
	var self = this,
		p = ++self.loadedIndex / self.total,
		progress = p > 1 ? 1 : p,
		x = self.T * progress,
		y = -self.A * Math.sin(progress * Math.PI * 2);

	self.paintingLayer.graphics.beginPath();
	self.paintingLayer.graphics.lineCap("round");
	self.paintingLayer.graphics.lineWidth(25);
	self.paintingLayer.graphics.strokeStyle("#00FF00");
	self.paintingLayer.graphics.moveTo(x, y);
	self.paintingLayer.graphics.lineTo(self.lastPoint.x, self.lastPoint.y);
	self.paintingLayer.graphics.stroke();

	self.lastPoint = new LPoint(x, y);
};