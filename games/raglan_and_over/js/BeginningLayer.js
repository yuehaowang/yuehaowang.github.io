function BeginningLayer () {
	var s = this;
	LExtends(s, LSprite, []);

	var bg = new LShape();
	bg.graphics.drawRect(0, "", [0, 0, LGlobal.width, LGlobal.height], true, "#DEDEDE");
	s.addChild(bg);

	var title = new Label(true);
	title.text = "Reglan and Over";
	title.textAlign = "center"
	title.size = 70;
	title.x = LGlobal.width / 2;
	title.y = -100;
	s.addChild(title);

	var btnR = 70, btnSR = btnR * 0.75;

	var normalShape = new LShape();
	normalShape.graphics.drawArc(3, "white", [0, 0, btnR, 0, Math.PI * 2], true, "black");
	var overShape = new LShape();
	overShape.graphics.drawArc(3, "white", [0, 0, btnR, 0, Math.PI * 2], true, "#00A2E8");
	var playSymbol = new LShape();
	playSymbol.graphics.drawVertices(0, "", [
		[-btnSR / 2, -btnSR * 0.85], [btnSR, 0], [-btnSR / 2, btnSR * 0.85]
	], true, "white");

	var btn = new LButton(normalShape, overShape);
	btn.x = LGlobal.width / 2;
	btn.y = LGlobal.height;
	btn.staticMode = true;
	btn.addChild(playSymbol);
	btn.setState(LButton.STATE_DISABLE);
	btn.setCursorEnabled(false);
	btn.addShape(LShape.ARC, [0, 0, btnR]);
	s.addChild(btn);

	LTweenLite.to(title, 0.8, {
		y : 50,
		ease : Cubic.easeOut
	});

	LTweenLite.to(btn, 0.8, {
		y : 300,
		rotate : 360 * 9,
		ease : Back.easeOut,
		onComplete : function () {
			btn.setState(LButton.STATE_ENABLE);
			btn.setCursorEnabled(true);
		}
	});

	btn.addEventListener(LMouseEvent.MOUSE_UP, function () {
		s.remove();

		addSceneLayer();
	});
}