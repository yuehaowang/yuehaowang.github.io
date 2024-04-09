function GameLayer () {
	var self = this;
	LExtends(self, LSprite, []);

	self.addBirdSpeed = GameLayer.NORMAL_SPEED_OF_ADDING_BIRD;
	self.addBirdSpeedIndex = 0;

	self.bg = new LBitmap(new LBitmapData(dataList["bg"]));
	self.addChild(self.bg);

	self.point = 0;
	self.pointText = null;

	self.time = GameLayer.GAME_TIME;
	self.preTime = (new Date()).getTime();

	self.pauseTime = null;
	self.pauseBtn = null;

	/** The flag of game over: 0 - running; 1 - waiting for showing result; 2 - showing result */
	self.gameOverState = 0;
	self.isPause = false;
	/** The flag of super time: 0 - waiting; 1 - running; 2 - over */
	self.superTimeState = 0;

	self.timeTxt = null;
	self.timeTxtTween = null;
	self.msgTxt = null;
	self.msgTxtTween = null;

	self.birdLayer = new LSprite();
	self.addChild(self.birdLayer);

	self.runnerLayer = new Runner();
	self.addChild(self.runnerLayer);

	self.stoneLayer = new LSprite();
	self.addChild(self.stoneLayer);

	self.effectLayer = new LSprite();
	self.addChild(self.effectLayer);

	self.overLayer = new LSprite();
	self.addChild(self.overLayer);

	self.pauseMenuLayer = new PauseMenu();
	self.pauseMenuLayer.y = 250;
	self.addChild(self.pauseMenuLayer);
	
	self.pauseMenuLayer.onClickHomeBtn = function () {
		self.destroy(1);
	};

	self.pauseMenuLayer.onClickReplayBtn = function () {
		self.destroy(0);
	};

	self.addPointText();
	self.addTimeText();
	self.addPauseBtn();

	self.addEvents();
}

GameLayer.NORMAL_SPEED_OF_ADDING_BIRD = 80;
GameLayer.GAME_TIME = 99;

GameLayer.prototype.addPointText = function () {
	var self = this;

	self.pointTxt = new LTextField();
	self.pointTxt.size = 35;
	self.pointTxt.weight = "bolder";
	self.pointTxt.textAlign = "center";
	self.pointTxt.x = LGlobal.width / 2;
	self.pointTxt.y = 20;
	self.pointTxt.color = "#FFFFFF";
	self.overLayer.addChild(self.pointTxt);

	self.addPoint(0);
};

GameLayer.prototype.addTimeText = function () {
	var self = this;

	self.timeTxt = new LTextField();
	self.timeTxt.size = 35;
	self.timeTxt.textAlign = "center";
	self.timeTxt.textBaseline = "middle";
	self.timeTxt.x = 50;
	self.timeTxt.y = LGlobal.height - 40;
	self.timeTxt.color = "#FFFFFF";
	self.timeTxt.text = self.time + "s";
	self.overLayer.addChild(self.timeTxt);
};

GameLayer.prototype.addPauseBtn = function () {
	var self = this;

	self.pauseBtn = new PauseButton();
	self.pauseBtn.x = LGlobal.width - self.pauseBtn.getWidth() - 10;
	self.pauseBtn.y = 10;
	self.overLayer.addChild(self.pauseBtn);

	self.pauseBtn.onClick = function () {
		self.isPause = !self.isPause;

		if (self.isPause) {
			LTweenLite.pauseAll();

			self.pauseTime = (new Date()).getTime();

			self.pauseMenuLayer.showMenu();
		} else {
			LTweenLite.resumeAll();

			self.preTime += (new Date()).getTime() - self.pauseTime;
			self.pauseTime = null;

			self.pauseMenuLayer.hideMenu();
		}
	};
};

GameLayer.prototype.addEvents = function () {
	var self = this;

	self.addEventListener(LEvent.ENTER_FRAME, self.update);
	self.addEventListener(LMouseEvent.MOUSE_DOWN, self.onDown);
};

GameLayer.prototype.update = function (e) {
	var self = e.currentTarget, currentTime = (new Date()).getTime();

	if (self.isPause) {
		return;
	}

	if (self.gameOverState == 0 && currentTime - self.preTime >= 1000) {
		self.time -= 1;
		self.preTime = currentTime;

		self.timeTxt.text = self.time + "s";

		if (self.time <= 0) {
			self.gameOverState = 1;

			if (self.timeTxtTween) {
				LTweenLite.remove(self.timeTxtTween);

				self.timeTxtTween = null;
			}
		}

		self.checkWhetherTimeWillSoonBeUp();

		self.checkSuperTime();
	}

	self.runnerLayer.update();

	self.updateLayer(self.stoneLayer);
	self.updateLayer(self.birdLayer);

	if (self.gameOverState == 1) {
		self.gameOver();
	}

	if (self.gameOverState == 0 && self.addBirdSpeedIndex++ >= self.addBirdSpeed) {
		self.addBirdSpeedIndex = 0;

		var bird = new Bird();
		self.birdLayer.addChild(bird);
	}
};

GameLayer.prototype.checkWhetherTimeWillSoonBeUp = function () {
	var self = this;

	if (self.time == 9) {
		self.timeTxt.stroke = true;
		self.timeTxt.lineWidth = 5;
		self.timeTxt.lineColor = "#AA0000";

		self.timeTxtTween = LTweenLite.to(self.timeTxt, 0.3, {
			scaleX : 1.5,
			scaleY : 1.5,
			loop : true
		}).to(self.timeTxt, 0.3, {
			scaleX : 1,
			scaleY : 1
		});
	}
};

GameLayer.prototype.checkSuperTime = function () {
	var self = this;

	if (self.superTimeState == 0 && self.time >= 30 && self.time <= 70) {
		if (Math.random() < 0.3) {
			self.superTimeState = 1;
			
			self.superTimeStartTime = self.time;
			self.superTimePeriod = 10 + Math.floor(Math.random() * 10);

			self.addBirdSpeedIndex = 0;
			self.addBirdSpeed = 10 + Math.floor(Math.random() * 8);

			self.runnerLayer.w = 500;

			Stone.v0 = 14;
			Stone.numLimit = 4;

			self.showMsgTxt("ATTENTION !!!");
		}
	} else if (self.superTimeState == 1) {
		if (self.superTimeStartTime - self.time >= self.superTimePeriod) {
			self.superTimeState = 2;

			self.superTimeStartTime = null;
			self.superTimePeriod = null;

			self.addBirdSpeedIndex = 0;
			self.addBirdSpeed = GameLayer.NORMAL_SPEED_OF_ADDING_BIRD;

			self.runnerLayer.w = Runner.NORMAL_ROTATING_SPEED;

			Stone.v0 = Stone.NORMAL_V0;
			Stone.numLimit = Stone.NORMAL_NUM_LIMIT;
		}
	}
};

GameLayer.prototype.updateLayer = function (layer) {
	var self = this;

	for (var i = 0; i < layer.numChildren; i++) {
		var o = layer.getChildAt(i);

		if (!o) {
			continue;
		}

		o.update();
	}
};

GameLayer.prototype.onDown = function (e) {
	var self = e.currentTarget, angle;

	if (
		self.gameOverState != 0
		|| self.stoneLayer.numChildren >= Stone.numLimit
		|| (self.pauseBtn && self.pauseBtn.onDown(e))
		|| self.isPause
	) {
		return;
	}

	angle = self.runnerLayer.runningLayer.rotate * Math.PI / 180;

	var stone = self.runnerLayer.currentStone.clone();
	stone.x = self.runnerLayer.x + self.runnerLayer.r * Math.cos(angle);
	stone.y = self.runnerLayer.y + self.runnerLayer.r * Math.sin(angle);
	stone.setAngle(angle);
	self.stoneLayer.addChild(stone);

	self.runnerLayer.updateStone();
};

GameLayer.prototype.showMsgTxt = function (content) {
	var self = this;

	if (self.msgTxt) {
		if (self.msgTxtTween) {
			LTweenLite.remove(self.msgTxtTween);
		}

		LTweenLite.to(self.msgTxt, 0.3, {
			y : 500,
			alpha : 0,
			size : 10,
			ease : LEasing.Circ.easeOut,
			onComplete : function (o) {
				o.remove();
			}
		});
	}

	var msgTxt = new LTextField();
	msgTxt.text = content;
	msgTxt.alpha = 0;
	msgTxt.color = "#FFFFFF";
	msgTxt.stroke = true;
	msgTxt.lineWidth = 5;
	msgTxt.lineColor = "#EE6633";
	msgTxt.size = 10;
	msgTxt.x = LGlobal.width / 2;
	msgTxt.y = 250;
	msgTxt.textAlign = "center";
	msgTxt.textBaseline = "middle";
	self.effectLayer.addChild(msgTxt);

	self.msgTxt = msgTxt;

	self.msgTxtTween = LTweenLite.to(self.msgTxt, 0.4, {
		size : 40,
		alpha : 1,
		ease : LEasing.Elastic.easeOut
	}).to(msgTxt, 0.4, {
		delay : 1,
		y : 0,
		alpha : 0,
		size : 10,
		ease : LEasing.Back.easeIn,
		onComplete : function () {
			self.msgTxt.remove();

			self.msgTxt = null;
			self.msgTxtTween = null;
		}
	});
};

GameLayer.prototype.continuousKill = function (koCount) {
	var self = this, textList;

	if (koCount < 2) {
		return;
	}

	koCount = (koCount > 8) ? 8 : koCount;

	textList = [
		"DOUBLE KILL",
		"TRIPLE KILL",
		"QUADRUPLE KILL",
		"PENTA KILL",
		"KILLING SPREE",
		"GOD LIKE",
		"LEGENDARY"
	];

	self.addPoint(koCount);

	self.showMsgTxt(textList[koCount - 2])
};

GameLayer.prototype.addPoint = function (v) {
	var self = this;

	self.pointTxt.text = self.point += v;
};

GameLayer.prototype.gameOver = function () {
	var self = this;

	if (
		self.birdLayer.numChildren == 0
		&& self.stoneLayer.numChildren == 0
		&& self.effectLayer.numChildren == 0
	) {
		self.gameOverState = 2;

		self.getRanking();

		/** Create game over interface */

		var hintTxt = new LTextField();
		hintTxt.size = 40;
		hintTxt.weight = "bolder";
		hintTxt.textAlign = "center";
		hintTxt.x = LGlobal.width / 2;
		hintTxt.y = -80;
		hintTxt.color = "#FFFFFF";
		hintTxt.lineWidth = 4;
		hintTxt.lineColor = "#AA6633";
		hintTxt.stroke = true;
		hintTxt.text = "YOU GOT"
		self.overLayer.addChild(hintTxt);

		var btnR = 90;
		var replayBtn = new RoundButton("Replay", btnR, 35);
		replayBtn.x = (LGlobal.width - btnR * 2) / 2;
		replayBtn.y = LGlobal.height;
		self.overLayer.addChild(replayBtn);
		replayBtn.addEventListener(LMouseEvent.MOUSE_UP, function () {
			self.destroy(0);
		});

		var shareLayer = new ShareBox(self.point);
		shareLayer.x = (LGlobal.width - shareLayer.getWidth()) / 2;
		shareLayer.y = LGlobal.height;
		self.overLayer.addChild(shareLayer);


		/** Attach animation */

		LTweenLite.to(hintTxt, 0.8, {
			y : 100,
			ease : LEasing.Back.easeInOut
		});

		LTweenLite.to(replayBtn, 0.8, {
			y : 370,
			ease : LEasing.Back.easeInOut
		}).to(shareLayer, 0.3, {
			y : 590,
			ease : LEasing.Quad.easeOut
		});

		LTweenLite.to(self.pointTxt, 0.8, {
			y : 190,
			size : 90,
			ease : LEasing.Back.easeInOut,
			onStart : function () {
				self.pointTxt.lineWidth = 4;
				self.pointTxt.lineColor = "#AA6633";
				self.pointTxt.stroke = true;
			}
		});

		LTweenLite.to(self.runnerLayer, 0.5, {
			y : LGlobal.height + 200,
			onComplete : function () {
				self.runnerLayer.remove();
			}
		});

		LTweenLite.to(self.timeTxt, 0.5, {
			x : -self.timeTxt.getWidth(),
			onComplete : function () {
				self.timeTxt.remove();
			}
		});

		LTweenLite.to(self.pauseBtn, 0.5, {
			x : LGlobal.width,
			onComplete : function () {
				self.pauseBtn.remove();
			}
		});
	}
};

GameLayer.prototype.getRanking = function () {
	var self = this;

	var rankingTxt = new LTextField();
	rankingTxt.alpha = 0;
	rankingTxt.text = "Getting ranking...";
	rankingTxt.size = 22;
	rankingTxt.textAlign = "center";
	rankingTxt.x = LGlobal.width / 2;
	rankingTxt.y = 310;
	rankingTxt.color = "#fff949";
	rankingTxt.stroke = true;
	rankingTxt.lineColor = "#9E4500";
	rankingTxt.lineWidth = 3;
	self.overLayer.addChild(rankingTxt);

	LTweenLite.to(rankingTxt, 0.5, {
		delay : 0.5,
		alpha : 1
	});

	LAjax.get(
		"http://wyh.wjjsoft.com/cgi-bin/cgi_ranking_system.cgi",
		{
			index : 1,
			point : self.point,
			type : "ranking_index"
		},
		function (data) {
			var ranking = parseInt(data);

			if (isNaN(ranking)) {
				rankingTxt.text = ranking;

				return;
			}

			if (ranking > 10000) {
				ranking = "10000+";
			}

			rankingTxt.text = "Universe Ranking: " + ranking;
		},
		function (e) {
			rankingTxt.text = "Failed to get ranking :(";
		}
	);
};

GameLayer.prototype.destroy = function (command) {
	var self = this;

	self.mouseEnabled = false;

	sceneTransition(function () {
		self.remove();

		delete self.bg;

		if (command == 0) {
			startGame();
		} else if (command == 1) {
			addBeginningLayer();
		}
	});
}