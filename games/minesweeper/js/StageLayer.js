function StageLayer () {
	var s = this;
	LExtends(s, LSprite, []);

	var bgBmp = new LBitmap(new LBitmapData(dataList["bg"]));
	bgBmp.scaleX = LGlobal.width / bgBmp.getWidth();
	bgBmp.scaleY = LGlobal.height / bgBmp.getHeight();
	s.addChild(bgBmp);

	s.infoLayer = new InfoLayer();
	s.infoLayer.x = (LGlobal.width - s.infoLayer.getWidth()) / 2;
	s.infoLayer.y = 40;
	s.addChild(s.infoLayer);

	s.mineLayer = null;

	s.createMineLayer();
}
StageLayer.prototype.createMineLayer = function () {
	var s = this;

	if (s.mineLayer) {
		s.mineLayer.remove();
	}

	s.mineLayer = new MineLayer();
	s.mineLayer.x = (LGlobal.width - s.mineLayer.getWidth()) / 2;
	s.mineLayer.y = s.infoLayer.y + s.infoLayer.getHeight() + 30;
	s.addChild(s.mineLayer);
};