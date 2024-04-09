function Explosion () {
	var self = this;
	LExtends(self, LSprite, []);

	var bmp = new LBitmap(new LBitmapData(dataList["explosion"]));
	bmp.x = -bmp.getWidth() / 2;
	bmp.y = -bmp.getHeight() / 2;
	self.addChild(bmp);

	self.scaleX = 0.3;
	self.scaleY = 0.3;
	self.alpha = 0.2;

	LTweenLite.to(self, 0.3, {
		scaleX : 1,
		scaleY : 1,
		alpha : 1,
	}).to(self, 0.2, {
		delay : 0.2,
		alpha : 0,
		onComplete : function () {
			self.remove();
		}
	});
}