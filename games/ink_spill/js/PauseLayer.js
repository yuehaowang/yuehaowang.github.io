function PauseLayer () {
	var self = this;
	LExtends(self, LSprite, []);

	self.createBtns();
}

PauseLayer.EVENT_CLOSED = "event_closed";
PauseLayer.EVENT_REPLAY_BTN_CLICKED = "event_replay_btn_clicked";
PauseLayer.EVENT_BACK_BTN_CLICKED = "event_back_btn_clicked";


PauseLayer.prototype.createBtns = function () {
	var self = this, marginTop = RoundButton.BUTTON_HEIGHT + 20;

	self.alpha = 0;
	self.mouseChildren = false;

	var bgSh = new LShape();
	bgSh.alpha = 0.6;
	bgSh.graphics.drawRect(0, "", [0, 0, LGlobal.width, LGlobal.height], true, "#000000");
	self.addChild(bgSh);

	var btnLayer = new LSprite();
	self.addChild(btnLayer);

	var replayBtn = new RoundButton("replay");
	replayBtn.x = (LGlobal.width - RoundButton.BUTTON_WIDTH) / 2;
	btnLayer.addChild(replayBtn);
	replayBtn.addEventListener(LMouseEvent.MOUSE_UP, function () {
		self.dispatchEvent(PauseLayer.EVENT_REPLAY_BTN_CLICKED);
	});

	var backBtn = new RoundButton("back");
	backBtn.x = replayBtn.x;
	backBtn.y = marginTop;
	btnLayer.addChild(backBtn);
	backBtn.addEventListener(LMouseEvent.MOUSE_UP, function () {
		self.dispatchEvent(PauseLayer.EVENT_BACK_BTN_CLICKED);
	});

	var closeBtn = PauseLayer.createCloseBtn();
	closeBtn.x = LGlobal.width / 2;
	closeBtn.y = marginTop * 2 + 50;
	btnLayer.addChild(closeBtn);
	closeBtn.addEventListener(LMouseEvent.MOUSE_UP, function () {
		self.dispatchEvent(PauseLayer.EVENT_CLOSED);

		self.remove();
	});

	btnLayer.y = (LGlobal.height - btnLayer.getHeight()) / 2;

	LTweenLite.to(self, 0.5, {
		alpha : 1,
		onComplete : function () {
			self.mouseChildren = true;
		}
	});
};

PauseLayer.createCloseBtn = function () {
	var size = 30, size2 = size * 0.8, a1 = Math.PI / 4, a2 = Math.PI / 4 * 3;

	var closeBtn = new LSprite();
	closeBtn.filters = [new LDropShadowFilter(1, 1, "#555555", 15)];
	closeBtn.addShape(LShape.ARC, [0, 0, size]);
	closeBtn.graphics.add(function () {
		var c = LGlobal.canvas;

		c.lineWidth = 5;
		c.strokeStyle = "#FFFFFF";
		c.fillStyle = "#333333";

		c.beginPath();
		c.arc(0, 0, size, 0, Math.PI * 2);
		c.stroke();
		c.fill();

		c.lineWidth = 5;
		c.lineCap = "round";

		c.beginPath();
		c.moveTo(size2 * Math.cos(a1), size2 * Math.sin(a1));
		c.lineTo(size2 * Math.cos(-a2), size2 * Math.sin(-a2));
		c.stroke();

		c.beginPath();
		c.moveTo(size2 * Math.cos(-a1), size2 * Math.sin(-a1));
		c.lineTo(size2 * Math.cos(a2), size2 * Math.sin(a2));
		c.stroke();
	});

	return closeBtn;
};