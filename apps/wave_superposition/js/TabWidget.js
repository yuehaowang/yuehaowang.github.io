function TabWidget (list) {
	var s = this;
	LExtends(s, LSprite, []);

	s.selectorLayer = new LSprite();
	s.addChild(s.selectorLayer);

	s.contentLayer = new LSprite();
	s.contentLayer.y = 60;
	s.addChild(s.contentLayer);

	for (var i = 0, l = list.length; i < l; i++) {
		var item = list[i], title = item.title, content = item.content;

		var selectorBtn = TabWidget.createTabBtn(title);
		selectorBtn.index = i;
		selectorBtn.x = s.selectorLayer.getWidth();
		s.selectorLayer.addChild(selectorBtn);

		content.index = i;
		content.visible = false;
		s.contentLayer.addChild(content);
	}

	var lineSh = new LShape();
	lineSh.graphics.drawLine(4, "#222222", [0, s.selectorLayer.getHeight(), LGlobal.width - 50, s.selectorLayer.getHeight()])
	s.addChild(lineSh);

	s.selectorLayer.addEventListener(LMouseEvent.MOUSE_UP, function (e) {
		var ind = e.target.index;

		if (typeof ind == "undefined") {
			return;
		}

		s.switchTo(ind);
	});

	s.switchTo(0);
}

TabWidget.createTabBtn = function (txt) {
	var marginX = 20, marginY = 10;

	var btn = new LSprite();

	var label = new LTextField();
	label.x = marginX;
	label.y = marginY;
	label.text = txt;
	label.size = 20;
	label.color = "#FFFFFF";
	btn.addChild(label);

	btn.graphics.drawRoundRect(0, "", [0, 0, label.getWidth() + marginX * 2, label.getHeight() * 1.2 + marginY * 2, 8], true, "#585858");

	return btn;
};

TabWidget.prototype.switchTo = function(index) {
	var s = this;

	for (var i = 0, l = s.selectorLayer.numChildren; i < l; i++) {
		var btn = s.selectorLayer.getChildAt(i),
			content = s.contentLayer.getChildAt(i);

		var btnBgColor = "#585858",
			btnW = btn.getWidth(),
			btnH = btn.getHeight();

		content.visible = false;

		if (btn.index == index) {
			btnBgColor = "#222222";

			content.visible = true;
		}

		btn.graphics.clear();
		btn.graphics.drawRoundRect(0, "", [0, 0, btnW, btnH, 8], true, btnBgColor);
	}
};