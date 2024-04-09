function GameLayer (col, row, time) {
	var self = this;
	LExtends(self, LSprite, []);

	self.isGameOver = false;

	var bgShape = new LShape();
	bgShape.graphics.drawRect(0, "", [0, 0, LGlobal.width, LGlobal.height], true, "#222222");
	bgShape.cacheAsBitmap(true);
	self.addChild(bgShape);

	self.menuBtn = new MenuButton();
	self.menuBtn.x = 30;
	self.menuBtn.y = 30;
	self.addChild(self.menuBtn);
	self.menuBtn.addEventListener(LMouseEvent.MOUSE_UP, function () {
		self.pauseGame();
	});

	self.timer = new CountdownTimer(time, {textAlign : "right"});
	self.timer.x = LGlobal.width - 30;
	self.timer.y = 22;
	self.addChild(self.timer);
	self.timer.addEventListener(CountdownTimer.EVENT_TIME_UP, function () {
		self.gameOver();
	});

	self.blockLayer = new BlockLayer(col, row);
	self.blockLayer.x = (LGlobal.width - self.blockLayer.getWidth()) / 2;
	self.blockLayer.y = LGlobal.height * 0.15;
	self.addChild(self.blockLayer);

	self.selectorLayer = new SelectorLayer();
	self.selectorLayer.x = (LGlobal.width - self.selectorLayer.getWidth()) / 2;
	self.selectorLayer.y = LGlobal.height - self.selectorLayer.getHeight() - 10;
	self.addChild(self.selectorLayer);
	self.selectorLayer.addEventListener(LMouseEvent.MOUSE_DOWN, function (e) {
		self.onSelectorClicked(e);
	});

	self.fadeIn();
}

GameLayer.prototype.onSelectorClicked = function (e) {
	var self = this, selectedColorIndex = e.target.index;

	if (typeof selectedColorIndex == "undefined") {
		return;
	}

	self.selectorLayer.mouseEnabled = false;

	self.blockLayer.startSpilling(selectedColorIndex, function () {
		if (self.blockLayer.completionRate == 1) {
			self.timer.setPause(true);

			self.gameOver();

			return;
		}

		if (!self.isGameOver) {
			self.selectorLayer.mouseEnabled = true;
		}
	});
};

GameLayer.prototype.fadeIn = function () {
	var self = this;

	self.mouseChildren = false;

	self.timer.setPause(true);

	var curtainSh = new LSprite();
	curtainSh.alpha = 1;
	curtainSh.graphics.drawRect(0, "", [0, 0, LGlobal.width, LGlobal.height], true, "#000000");
	self.addChild(curtainSh);

	LTweenLite.to(curtainSh, 0.5, {
		alpha : 0,
		onComplete : function () {
			curtainSh.remove();

			var format = {
				noUnit : true,
				size : 80,
				textBaseline : "middle",
				stroke : true,
				weight : "bold",
				lineWidth : 5
			};

			var countdown = new CountdownTimer(3, format);
			countdown.x = LGlobal.width / 2;
			countdown.y = LGlobal.height * 0.35;
			self.addChild(countdown);

			LTweenLite.to(countdown, 0.5, {
				delay : 0.1,
				scaleX : 2,
				scaleY : 2,
				ease : LEasing.Sine.easeInOut,
				loop : true
			}).to(countdown, 0.4, {
				scaleX : 1,
				ease : LEasing.Sine.easeInOut,
				scaleY : 1
			});

			countdown.addEventListener(CountdownTimer.EVENT_TIME_UP, function () {
				self.mouseChildren = true;

				self.timer.setPause(false);

				LTweenLite.to(countdown, 0.3, {
					alpha : 0,
					y : countdown.y - 50,
					onComplete : function () {
						countdown.remove();
					}
				});
			});
			countdown.setPause(false);
		}
	});
};

GameLayer.prototype.gameOver = function () {
	var self = this;

	self.isGameOver = true;

	self.selectorLayer.mouseEnabled = false;
	self.menuBtn.mouseEnabled = false;

	var timer = new LTimer(1000, 1);
	timer.addEventListener(LTimerEvent.TIMER_COMPLETE, function () {
		var rate = self.blockLayer.completionRate, usedTime = self.timer.getUsedTime();

		self.blockLayer.blinkOutAllBlocks(function () {
			self.blockLayer.remove();

			LTweenLite.to(self.selectorLayer, 0.3, {
				y : LGlobal.height,
				ease : LEasing.Back.easeIn,
				onComplete : function () {
					self.selectorLayer.remove();
				}
			});

			LTweenLite.to(self.timer, 0.3, {
				y : -self.timer.getHeight(),
				ease : LEasing.Back.easeOut,
				onComplete : function () {
					self.timer.remove();
				}
			});

			LTweenLite.to(self.menuBtn, 0.3, {
				y : -self.menuBtn.getHeight(),
				ease : LEasing.Back.easeOut,
				onComplete : function () {
					self.menuBtn.remove();

					self.remove();

					addGameResult(rate, usedTime);
				}
			});
		});
	});
	timer.start();
};

GameLayer.prototype.pauseGame = function () {
	var self = this;

	self.timer.setPause(true);
	self.selectorLayer.mouseEnabled = false;
	self.menuBtn.mouseEnabled = false;

	var pauseLayer = new PauseLayer();
	self.addChild(pauseLayer);

	pauseLayer.addEventListener(PauseLayer.EVENT_REPLAY_BTN_CLICKED, function () {
		var curtainSh = new LSprite();
		curtainSh.alpha = 0;
		curtainSh.graphics.drawRect(0, "", [0, 0, LGlobal.width, LGlobal.height], true, "#000000");
		self.addChild(curtainSh);

		LTweenLite.to(curtainSh, 1, {
			alpha : 1,
			onComplete : function () {
				self.remove();

				newGame();
			}
		});
	});

	pauseLayer.addEventListener(PauseLayer.EVENT_BACK_BTN_CLICKED, function () {
		self.remove();

		addHomePage();
	});

	pauseLayer.addEventListener(PauseLayer.EVENT_CLOSED, function () {
		self.timer.setPause(false);
		self.selectorLayer.mouseEnabled = true;
		self.menuBtn.mouseEnabled = true;
	});
};