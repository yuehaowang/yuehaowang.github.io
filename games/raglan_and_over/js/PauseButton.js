function PauseButton () {
	var s = this;
	LExtends(s, LSprite, []);

	s.state = PauseButton.STATE_PLAY;

	s.pauseBmp = new LBitmap(new LBitmapData(dataList["pause"]));
	s.addChild(s.pauseBmp);

	s.playBmp = new LBitmap(new LBitmapData(dataList["play"]));
	s.playBmp.visible = false;
	s.addChild(s.playBmp);

	s.addEventListener(LMouseEvent.MOUSE_UP, s.onMouseUp);
}

PauseButton.STATE_PAUSE = "pause";
PauseButton.STATE_PLAY = "play";

PauseButton.prototype.pause = function () {
	var s = this;

	s.pauseBmp.visible = false;
	s.playBmp.visible = true;

	if (s.parent && s.parent.playerLayer) {
		s.parent.playerLayer.pause = true;
	}

	if (s.parent && s.parent.obstacleLayer) {
		s.parent.obstacleLayer.pause = true;
	}

	s.state = PauseButton.STATE_PAUSE;

	LTweenLite.pauseAll();
};

PauseButton.prototype.play = function () {
	var s = this;

	s.pauseBmp.visible = true;
	s.playBmp.visible = false;

	if (s.parent && s.parent.playerLayer) {
		s.parent.playerLayer.pause = false;
	}

	if (s.parent && s.parent.obstacleLayer) {
		s.parent.obstacleLayer.pause = false;
	}

	s.state = PauseButton.STATE_PLAY;

	LTweenLite.resumeAll();
};

PauseButton.prototype.onMouseUp = function (e) {
	var s = e.currentTarget;
	
	if (s.state == PauseButton.STATE_PLAY) {
		s.pause();
	} else if (s.state == PauseButton.STATE_PAUSE) {
		s.play();
	}
};