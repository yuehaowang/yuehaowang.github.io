function SelectorLayer () {
	var self = this;
	LExtends(self, LSprite, []);

	self.w = 0;

	self.createSelectors();
}

SelectorLayer.prototype.createSelectors = function () {
	var self = this, marginRight = 10, cl = new Array();

	for (var i = 0, len = Block.COLOR_LIST.length; i < len; i++) {
		cl[i] = i;
	}

	cl.sort(function () {
		return Math.random() < 0.5 ? 1 : -1;
	});

	for (var j = 0, n = cl.length; j < n; j++) {
		var index = cl[j];
		var selector = new Block(index, index);
		selector.x = j * (Block.WIDTH + marginRight) + marginRight;
		selector.y = marginRight;
		selector.setShadow();
		self.addChild(selector);
	}

	var w = self.getWidth(), h = self.getHeight();

	self.graphics.drawRoundRect(0, "", [0, 0, w + marginRight, h + marginRight, 15], true, "#3A3A3A");

	self.cacheAsBitmap(true);

	self.w = w;
};