function HelpLayer (pauseBtn) {
	var s = this, pauseBtnOldState = pauseBtn.state;
	LExtends(s, LSprite, []);

	pauseBtn.pause();

	var bg = new LSprite();
	bg.alpha = 0.7;
	bg.graphics.drawRect(0, "", [0, 0, LGlobal.width, LGlobal.height], true, "black");
	bg.graphics.drawLine(3, "white", [0, LGlobal.height / 2, LGlobal.width, LGlobal.height / 2]);
	s.addChild(bg);

	var  hand = new LBitmap(new LBitmapData(dataList["hand"]));
	hand.x = 600;
	var hand1 = hand.clone();
	hand1.y = 300;
	s.addChild(hand1);
	var hand2 = hand.clone();
	hand2.y = 180;
	hand2.scaleY = -1;
	s.addChild(hand2);

	var hint = new Label(true);
	hint.textAlign = "right";
	hint.x = 550;
	hint.color = "white";
	hint.size = 20;
	var hint1 = hint.clone();
	hint1.text = "Tap this part of screen to make player move down";
	hint1.y = 330;
	s.addChild(hint1);
	var hint2 = hint.clone();
	hint2.text = "Tap this part of screen to make player move up";
	hint2.y = 120;
	s.addChild(hint2);

	s.addEventListener(LMouseEvent.MOUSE_UP, function () {
		s.remove();

		if (pauseBtnOldState == PauseButton.STATE_PLAY) {
			pauseBtn.play();
		}

	});
}