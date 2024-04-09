function MenuButton () {
	var self = this;
	LExtends(self, LSprite, []);

	self.createIcon();

	self.addShape(LShape.RECT, [-10, -10, self.getWidth() + 20, self.getHeight() + 20]);
}

MenuButton.prototype.createIcon = function () {
	var self = this, w = 30, h = 5, marginBottom = 10;

	for (var i = 0; i < 3; i++) {
		self.graphics.drawRect(0, "", [0, i * marginBottom, w, h], true, "#FFFFFF");
	}

	self.cacheAsBitmap(true);
};