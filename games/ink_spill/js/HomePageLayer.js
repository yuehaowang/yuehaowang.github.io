function HomePageLayer () {
	var self = this;
	LExtends(self, LSprite, []);

	self.createBg();

	self.mainLayer = new LSprite();
	self.addChild(self.mainLayer);

	self.titleLayer = new LSprite();
	self.mainLayer.addChild(self.titleLayer);

	self.btnLayer = new LSprite();
	self.mainLayer.addChild(self.btnLayer);

	self.createTitle();
	self.createBtns();

	self.mainLayer.y = (LGlobal.height - self.mainLayer.getHeight()) / 2;

	self.fadeIn();
}

HomePageLayer.prototype.createBg = function () {
	var self = this;

	var bgShape = new LShape();
	bgShape.graphics.drawRect(0, "", [0, 0, LGlobal.width, LGlobal.height], true, "#202020");
	bgShape.cacheAsBitmap(true);
	self.addChild(bgShape);

	var border = new ColorfulBorder(["#F92672", "#FD9720", "#87E22E", "#54D9EF"]);
	self.addChild(border);
};

HomePageLayer.prototype.createTitle = function () {
	var self = this, bs, cl = Block.COLOR_LIST;

	var list = [
		[
			[1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
			[0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0],
			[0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
			[0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0],
			[1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
		],
		[
			[1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0],
			[1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
			[1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0],
			[0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
			[1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1]
		]
	];

	for (var i = 0, l = list.length; i < l; i++) {
		var word = list[i];

		var wordLayer = new LSprite();
		self.titleLayer.addChild(wordLayer);

		if (i == 0) {
			bs = 20;
			wordLayer.x = bs * 3;
		} else if (i == 1) {
			bs = 17;

			wordLayer.x = bs * 5;
			wordLayer.y = self.titleLayer.getHeight() + bs * 2;
		}

		for (var j = 0, n = word.length; j < n; j++) {
			var row = word[j];

			for (var k = 0, len = row.length; k < len; k++) {
				if (row[k] == 1) {
					var c = cl[Math.floor(Math.random() * cl.length)];
					var b = new LShape();
					b.graphics.drawRoundRect(0, "", [0, 0, bs, bs, bs * 0.2], true, c);
					b.x = k * bs;
					b.y = j * bs;
					wordLayer.addChild(b);
				} 
			}
		}
	}

	self.titleLayer.cacheAsBitmap(true);
};

HomePageLayer.prototype.createBtns = function () {
	var self = this;

	self.btnLayer.y = self.mainLayer.getHeight() + 70;

	var playBtn = new RoundButton("play");
	self.btnLayer.addChild(playBtn);
	playBtn.addEventListener(LMouseEvent.MOUSE_UP, function () {
		self.onPlayBtnClicked();
	});

	self.btnLayer.x = (LGlobal.width - self.btnLayer.getWidth()) / 2;
};

HomePageLayer.prototype.onPlayBtnClicked = function () {
	var self = this;

	self.mouseChildren = false;

	var titleLayerOriginW = self.titleLayer.getWidth(),
		titleLayerOriginH = self.titleLayer.getHeight();

	LTweenLite.to(self.titleLayer, 0.4, {
		delay : 0.1,
		alpha : 0,
		scaleX : 3,
		scaleY : 3,
		ease : LEasing.Sine.easeIn,
		onUpdate : function () {
			self.titleLayer.x = -(self.titleLayer.scaleX - 1) * titleLayerOriginW * 0.5;
			self.titleLayer.y = -(self.titleLayer.scaleY - 1) * titleLayerOriginH * 0.5;
		}
	});

	LTweenLite.to(self.btnLayer, 0.4, {
		delay : 0.1,
		alpha : 0,
		x : LGlobal.width,
		ease : LEasing.Back.easeIn
	});

	var curtainSh = new LSprite();
	curtainSh.alpha = 0;
	curtainSh.graphics.drawRect(0, "", [0, 0, LGlobal.width, LGlobal.height], true, "#000000");
	self.addChild(curtainSh);

	LTweenLite.to(curtainSh, 0.7, {
		alpha : 1,
		onComplete : function () {
			self.remove();

			newGame();
		}
	});
};

HomePageLayer.prototype.fadeIn = function () {
	var self = this;

	self.mouseChildren = false;

	var curtainSh = new LSprite();
	curtainSh.alpha = 1;
	curtainSh.graphics.drawRect(0, "", [0, 0, LGlobal.width, LGlobal.height], true, "#000000");
	self.addChild(curtainSh);

	LTweenLite.to(curtainSh, 0.5, {
		alpha : 0,
		onComplete : function () {
			curtainSh.remove();

			self.mouseChildren = true;
		}
	});
};