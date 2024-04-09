function ColorfulBorder (colorList, sides) {
	var self = this;
	LExtends(self, LSprite, []);

	if (!sides) {
		sides = [0, 1, 2, 3];
	}

	self.createBorder(colorList, sides);
	self.cacheAsBitmap(true);
}

ColorfulBorder.prototype.createBorder = function (colorList, sides) {
	var self = this, bs = 20;

	for (var k = 0, n = sides.length; k < n; k++) {
		var j = sides[k], x0 = 0, y0 = 0, dl;

		if (j == 0) {
			y0 = 0;

			dl = LGlobal.width;
		} else if (j == 1) {
			y0 = LGlobal.height - bs;

			dl = LGlobal.width;
		} else if (j == 2) {
			x0 = 0;

			dl = LGlobal.height;
		} else if (j == 3) {
			x0 = LGlobal.width - bs;

			dl = LGlobal.height;
		}

		for (var i = 0, l = Math.ceil((dl / bs)); i < l; i++) {
			if (j == 0 || j == 1) {
				x0 = i * bs;
			} else if (j == 2 || j == 3) {
				y0 = i * bs;
			}

			var color = colorList[Math.floor(Math.random() * colorList.length)];

			var b = ColorfulBorder.createBlock(bs, bs, color);
			b.x = x0;
			b.y = y0;
			self.addChild(b);
		}
	}
};

ColorfulBorder.createBlock = function (w, h, c) {
	var b = new LShape();
	b.graphics.drawRoundRect(0, "", [0, 0, w, h, w * 0.2], true, c);

	return b;
};
