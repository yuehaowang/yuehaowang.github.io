function LoadBar (fileNum) {
	var s = this;
	LExtends(s, LSprite, []);

	s.fileNum = fileNum;
	s.loadedFileNum = -1;
	s.progressBarWidth = 300;
	s.progressBarHeight = 30;

	var bg = new LShape();
	bg.graphics.drawRect(0, "", [0, 0, LGlobal.width, LGlobal.height], true, "#CCCCCC");
	s.addChild(bg);

	var progressBox = new LSprite();
	progressBox.graphics.drawRoundRect(0, "", [0, 0, 400, 200, 10], true, "#DEDEDE");
	progressBox.filters = [new LDropShadowFilter(1, 45, "#7E7E7E", 15)];
	s.addChild(progressBox);

	s.progressBarTxt = new Label();
	s.progressBarTxt.size = 20;
	s.progressBarTxt.y = 190;
	s.addChild(s.progressBarTxt);

	var progressBar = new LSprite();
	s.addChild(progressBar);

	var progressBarBgLayer = new LShape();
	progressBarBgLayer.graphics.drawRoundRect(2, "#999999", [0, 0, s.progressBarWidth, s.progressBarHeight, 5]);
	progressBar.addChild(progressBarBgLayer)

	s.progressBarProgressLayer = new LShape();
	progressBar.addChild(s.progressBarProgressLayer)

	progressBar.x = (LGlobal.width - progressBar.getWidth()) / 2;
	progressBar.y = 250;

	progressBox.x = (LGlobal.width - progressBox.getWidth()) / 2;
	progressBox.y = (LGlobal.height - progressBox.getHeight()) / 2;

	s.setProgress(0);
}

LoadBar.prototype.setProgress = function (p) {
	var s = this, showWidth = s.progressBarWidth * (p / 100);

	s.progressBarProgressLayer.graphics.clear();
	s.progressBarProgressLayer.graphics.drawRoundRect(0, "", [2, 2, showWidth - 4, s.progressBarHeight - 4, 5], true, "#00A2E8");

	s.progressBarTxt.text = "Loading... " + (++s.loadedFileNum) + "/" + s.fileNum;
	s.progressBarTxt.x = (LGlobal.width - s.progressBarTxt.getWidth()) / 2;
};