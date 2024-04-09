function InfoLayer () {
	var s = this;
	LExtends(s, LSprite, []);

	s.mineLeftNumTxt = null;
	s.button = null;
	s.timeUsedTxt = null;

	s.timeUsedNum = 0;
	s.preTime = 0;
	s.mineLeftNum = mineNum;
	s.isStart = false;

	s.addMineLeftNumLayer();
	s.addButton();
	s.addTimeUsedLayer();

	s.addEventListener(LEvent.ENTER_FRAME, function () {
		if (!s.isStart) {
			return;
		}

		s.refreshTimeUsedNumTxt();
	});
}

InfoLayer.prototype.addMineLeftNumLayer = function () {
	var s = this;

	var mineLeftNumLayer = new LSprite();
	s.addChild(mineLeftNumLayer);

	s.mineLeftNumTxt = new LTextField();
	s.mineLeftNumTxt.text = 10000000;
	s.mineLeftNumTxt.color = "white";
	s.mineLeftNumTxt.size = 30;
	mineLeftNumLayer.addChild(s.mineLeftNumTxt);

	mineLeftNumLayer.graphics.drawRoundRect(
		2, "white",
		[
			-5, -5,
			s.mineLeftNumTxt.getWidth() + 10,
			s.mineLeftNumTxt.getHeight() + 10,
			3
		],
		true, "black"
	);

	s.mineLeftNumTxt.text = s.mineLeftNum;
};

InfoLayer.prototype.addButton = function () {
	var s = this, btnBmp = new LBitmap(new LBitmapData(dataList["face_smile"]));

	s.button = new ButtonTemplate(btnBmp, 1.2);
	s.button.x = s.getWidth() + 50;
	s.button.y = -15;
	s.addChild(s.button);
	s.button.addEventListener(LMouseEvent.MOUSE_UP, function () {
		s.timeUsedNum = 0;
		s.preTime = new Date().getTime();
		s.mineLeftNum = mineNum;
		s.isStart = false;

		s.parent.createMineLayer();
		
		s.refreshMineLeftNumTxt();
		s.refreshTimeUsedNumTxt();
		s.changeFace("smile");
	})
};

InfoLayer.prototype.addTimeUsedLayer = function () {
	var s = this;

	var timeUsedLayer = new LSprite();
	timeUsedLayer.x = s.getWidth() + 50;
	s.addChild(timeUsedLayer);

	s.timeUsedTxt = new LTextField();
	s.timeUsedTxt.text = 10000000;
	s.timeUsedTxt.color = "white";
	s.timeUsedTxt.size = 30;
	timeUsedLayer.addChild(s.timeUsedTxt);

	timeUsedLayer.graphics.drawRoundRect(
		2, "white",
		[
			-5, -5,
			s.timeUsedTxt.getWidth() + 10,
			s.timeUsedTxt.getHeight() + 10,
			3
		],
		true, "black"
	);

	s.timeUsedTxt.text = s.timeUsedNum;
};

InfoLayer.prototype.changeFace = function (name) {
	this.button.setContent(new LBitmap(new LBitmapData(dataList["face_" + name])));
};

InfoLayer.prototype.refreshMineLeftNumTxt = function () {
	this.mineLeftNumTxt.text = this.mineLeftNum;
};

InfoLayer.prototype.refreshTimeUsedNumTxt = function (e) {
	var s = this, nowTime = new Date().getTime();

	s.timeUsedNum += (nowTime - s.preTime) / 1000;

	s.preTime = nowTime;

	s.timeUsedTxt.text = parseInt(s.timeUsedNum);
};