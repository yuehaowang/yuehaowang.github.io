function ButtonTemplate (img, btnBmpScale) {
	var s = this;
	LExtends(s, LSprite, []);

	var btnImg = dataList["button_sheet"];
	var normalBmp = new LBitmap(new LBitmapData(btnImg, 0, 0, 48, 48));
	var overBmp = new LBitmap(new LBitmapData(btnImg, 0, 48, 48, 48));
	var downBmp = new LBitmap(new LBitmapData(btnImg, 0, 96, 48, 48));

	s.button = new LButton(normalBmp, overBmp, downBmp.clone(), downBmp.clone());
	s.button.scaleX = s.button.scaleY = btnBmpScale || 1;
	s.button.staticMode = true;
	s.addChild(s.button);

	s.content = null;

	if (typeof img == UNDEFINED || !img) {
		return;
	}

	s.setContent(img)
}

ButtonTemplate.prototype.setContent = function(content) {
	var s = this;

	s.removeContent();

	s.content = content;
	s.content.x = (s.button.getWidth() - s.content.getWidth()) / 2;
	s.content.y = (s.button.getHeight() - s.content.getHeight()) / 2;
	s.addChild(s.content);
};

ButtonTemplate.prototype.removeContent = function() {
	var s = this;

	if (s.content) {
		s.content.remove();

		s.content = null;
	}
};

ButtonTemplate.prototype.removeButton = function() {
	var s = this;

	if (s.button) {
		s.button.remove();
	}
};

ButtonTemplate.prototype.setIntoNormalState = function () {
	this.button.setState(LButton.STATE_ENABLE);
};

ButtonTemplate.prototype.setIntoOverState = function () {
	this.button.setState(LButton.STATE_DISABLE);
};