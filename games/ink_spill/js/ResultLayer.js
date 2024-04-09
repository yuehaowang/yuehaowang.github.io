function ResultLayer (rate, usedTime) {
	var self = this;
	LExtends(self, LSprite, []);

	self.createBg();

	self.mainLayer = new LSprite();
	self.addChild(self.mainLayer);

	self.resultContentLayer = new LSprite();
	self.mainLayer.addChild(self.resultContentLayer);

	self.btnLayer = new LSprite();
	self.mainLayer.addChild(self.btnLayer);

	self.createResultContent(rate, usedTime);
	self.createBtns();

	self.mainLayer.y = (LGlobal.height - self.mainLayer.getHeight()) / 2;
}

ResultLayer.prototype.createBg = function () {
	var self = this;

	var bgShape = new LShape();
	bgShape.graphics.drawRect(0, "", [0, 0, LGlobal.width, LGlobal.height], true, "#222222");
	bgShape.cacheAsBitmap(true);
	self.addChild(bgShape);

	var border = new ColorfulBorder(["#F92672", "#FD9720", "#87E22E", "#54D9EF"], [0, 1]);
	self.addChild(border);
};

ResultLayer.prototype.createResultContent = function (completionRate, usedTime) {
	var self = this, resultContent;

	if (completionRate >= 1) {
		resultContent = [
			{text : "Perfect!", size : 60, lineColor : "#87E22E", lineWidth : 5},
			{text : "You've finished it within " + usedTime + "s", size : 26, lineColor : "#87E22E", lineWidth : 2}
		];
	} else {
		resultContent = [
			{text : "Sorry!", size : 60, lineColor : "#F92672", lineWidth : 5},
			{text : "You've finished " + parseInt(completionRate * 100) + "%", size : 26, lineColor : "#F92672", lineWidth : 2}
		];
	}

	for (var i = 0, len = resultContent.length, toY = 0; i < len; i++) {
		var item = resultContent[i];

		var txt = new LTextField();
		txt.textAlign = "center";
		txt.heightMode = LTextField.HEIGHT_MODE_BASELINE;
		txt.x = LGlobal.width / 2;
		txt.y = toY;
		txt.text = item.text || "";
		txt.size = item.size || 20;
		txt.stroke = true;
		txt.lineColor = item.lineColor || "#FFFFFF";
		txt.lineWidth = item.lineWidth || 0;
		txt.color = "#FFFFFF";
		self.resultContentLayer.addChild(txt);

		toY = self.resultContentLayer.getHeight() + 30;
	}
};

ResultLayer.prototype.createBtns = function () {
	var self = this;

	self.btnLayer.y = self.mainLayer.getHeight() + 40;

	var replayBtn = new RoundButton("replay");
	self.btnLayer.addChild(replayBtn);
	replayBtn.addEventListener(LMouseEvent.MOUSE_UP, function () {
		self.remove();

		newGame();
	});

	var backBtn = new RoundButton("back");
	backBtn.y = RoundButton.BUTTON_HEIGHT + 25;
	self.btnLayer.addChild(backBtn);
	backBtn.addEventListener(LMouseEvent.MOUSE_UP, function () {
		self.remove();

		addHomePage();
	});

	self.btnLayer.x = (LGlobal.width - self.btnLayer.getWidth()) / 2;
};