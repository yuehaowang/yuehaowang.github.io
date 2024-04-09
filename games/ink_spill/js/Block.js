function Block (blockIndex, colorIndex) {
	var self = this;
	LExtends(self, LSprite, []);

	self.index = blockIndex;
	self.colorIndex = null;

	self.checked = false;

	self.shapeLayer = new LSprite();
	self.shapeLayer.x = Block.WIDTH / 2;
	self.shapeLayer.y = Block.HEIGHT / 2;
	self.addChild(self.shapeLayer);

	self.changeColor(colorIndex, true);
}

Block.WIDTH = 54;
Block.HEIGHT = 54;
Block.COLOR_LIST = ["#F92672", "#87E22E", "#54D9EF", "#FD9720", "#E6DB74", "#DA8D3E"];

Block.prototype.setShadow = function () {
	this.filters = [new LDropShadowFilter(1, 1, Block.COLOR_LIST[this.colorIndex], 7)];
};

Block.prototype.changeColor = function (colorIndex, withoutTween, onComplete) {
	var self = this;

	self.colorIndex = colorIndex;

	var fn = function () {
		self.shapeLayer.graphics.clear();
		self.shapeLayer.graphics.drawRoundRect(0, "", [-Block.WIDTH / 2, -Block.HEIGHT / 2, Block.WIDTH, Block.HEIGHT, 10], true, Block.COLOR_LIST[self.colorIndex]);
	}

	if (!onComplete) {
		onComplete = function () {};
	}

	if (withoutTween) {
		fn();
	} else {
		LTweenLite.to(self.shapeLayer, 0.2, {
			scaleX : 0,
			ease : LEasing.Back.easeIn,
			onComplete : function () {
				fn();
			}
		}).to(self.shapeLayer, 0.25, {
			scaleX : 1,
			ease : LEasing.Back.easeOut,
			onComplete : function () {
				onComplete();
			}
		});
	}
};

Block.prototype.blinkOut = function (onComplete) {
	var self = this;

	if (!onComplete) {
		onComplete = function () {};
	}

	var msk = new LShape();
	msk.alpha = 0;
	self.shapeLayer.addChild(msk);

	msk.graphics.drawRoundRect(0, "", [-Block.WIDTH / 2, -Block.HEIGHT / 2, Block.WIDTH, Block.HEIGHT, 10], true, "#FFFFFF");

	LTweenLite.to(msk, 0.3, {
		alpha : 1
	}).to(msk, 0.3, {
		delay : 0.1,
		alpha : 0
	}).to(msk, 0.3, {
		delay : 0.1,
		alpha : 1
	}).to(msk, 0.3, {
		delay : 0.1,
		alpha : 0
	}).to(msk, 0.3, {
		delay : 0.1,
		alpha : 1
	}).to(self, 0.5, {
		delay : 0.2,
		alpha : 0,
		onComplete : function () {
			msk.remove();
			
			onComplete();
		}
	});
};