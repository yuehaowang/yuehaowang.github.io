function PauseMenu () {
	var self = this;
	LExtends(self, LSprite, []);

	self.tweenList = new Array();
	self.onClickHomeBtn = null;
	self.onClickReplayBtn = null;
}

PauseMenu.HOME_BUTTON_NAME = "home_btn";
PauseMenu.REPLAY_BUTTON_NAME = "replay_btn";

PauseMenu.ButtonInfo = {
	INIT_SCALE : 0.5,
	INIT_ALPHA : 0.2,
	ROTATE_ANGLE : 720
};

PauseMenu.prototype.showMenu = function () {
	var self = this;

	if (!self.getChildByName(PauseMenu.HOME_BUTTON_NAME)) {
		var homeBtn = self.createBtn("Home");
		homeBtn.name = PauseMenu.HOME_BUTTON_NAME;
		homeBtn.x = -homeBtn.getWidth() / 2;
		self.addChild(homeBtn);

		homeBtn.addEventListener(LMouseEvent.MOUSE_UP, function () {
			if (typeof self.onClickHomeBtn == "function") {
				self.onClickHomeBtn();

				self.hideMenu();
			}
		});
	}

	if (!self.getChildByName(PauseMenu.REPLAY_BUTTON_NAME)) {
		var replayBtn = self.createBtn("Replay");
		replayBtn.name = PauseMenu.REPLAY_BUTTON_NAME;
		replayBtn.x = LGlobal.width + replayBtn.getWidth() / 2;
		replayBtn.y = 230;
		self.addChild(replayBtn);

		replayBtn.addEventListener(LMouseEvent.MOUSE_UP, function () {
			if (typeof self.onClickReplayBtn == "function") {
				self.onClickReplayBtn();

				self.hideMenu();
			}
		});
	}

	self.newTween([
		{
			x : LGlobal.width / 2,
			ease : LEasing.Back.easeOut,
			alpha : 1,
			scaleX : 1,
			scaleY : 1,
			rotate : -PauseMenu.ButtonInfo.ROTATE_ANGLE
		},
		{
			x : LGlobal.width / 2,
			ease : LEasing.Back.easeOut,
			alpha : 1,
			scaleX : 1,
			scaleY : 1,
			rotate : PauseMenu.ButtonInfo.ROTATE_ANGLE
		}
	]);
};

PauseMenu.prototype.hideMenu = function () {
	var self = this;

	var homeBtn = self.getChildByName(PauseMenu.HOME_BUTTON_NAME),
		replayBtn = self.getChildByName(PauseMenu.REPLAY_BUTTON_NAME);

	self.newTween([
		{
			x : -homeBtn.getWidth() / 2,
			ease : LEasing.Back.easeIn,
			alpha : PauseMenu.ButtonInfo.INIT_ALPHA,
			scaleX : PauseMenu.ButtonInfo.INIT_SCALE,
			scaleY : PauseMenu.ButtonInfo.INIT_SCALE,
			rotate : PauseMenu.ButtonInfo.ROTATE_ANGLE,
			onComplete : function () {
				homeBtn.remove();
			}
		},
		{
			x : LGlobal.width + replayBtn.getWidth() / 2,
			ease : LEasing.Back.easeIn,
			alpha : PauseMenu.ButtonInfo.INIT_ALPHA,
			scaleX : PauseMenu.ButtonInfo.INIT_SCALE,
			scaleY : PauseMenu.ButtonInfo.INIT_SCALE,
			rotate : -PauseMenu.ButtonInfo.ROTATE_ANGLE,
			onComplete : function () {
				replayBtn.remove();
			}
		}
	]);
};

PauseMenu.prototype.newTween = function (optList) {
	var self = this;

	self.mouseChildren = false;

	for (var i = 0, l = self.tweenList.length; i < l; i++) {
		LTweenLiteTimeline.remove(self.tweenList[i]);
	}

	for (var i = 0; i < self.numChildren; i++) {
		var o = self.getChildAt(i),
			toVars = {},
			opt = optList[i] || optList[0],
			onCompleteFunc = opt["onComplete"];

		if (!o) {
			return;
		}

		for (var k in opt) {
			toVars[k] = opt[k];
		}

		toVars["onComplete"] = function (e) {
			if (typeof onCompleteFunc == "function") {
				onCompleteFunc();
			}

			for (var i = 0, l = self.tweenList.length; i < l; i++) {
				var t = self.tweenList[i];

				if (!t) {
					continue;
				}

				if (t.objectIndex == e.currentTarget.objectIndex) {
					self.tweenList.splice(i, 1);

					break;
				}
			}

			self.mouseChildren = true;
		};

		var tween = LTweenLiteTimeline.to(o, 0.6, toVars);
		self.tweenList.push(tween);
	}
};

PauseMenu.prototype.createBtn = function (txt) {
	var btnR = 85;

	var btnContainer = new LSprite();
	btnContainer.alpha = PauseMenu.ButtonInfo.INIT_ALPHA;
	btnContainer.scaleX = PauseMenu.ButtonInfo.INIT_SCALE;
	btnContainer.scaleY = PauseMenu.ButtonInfo.INIT_SCALE;

	var btn = new RoundButton(txt, btnR, 30);
	btn.x = -btnR;
	btn.y = -btnR;
	btnContainer.addChild(btn);

	return btnContainer;
};