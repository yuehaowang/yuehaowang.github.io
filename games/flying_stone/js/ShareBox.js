function ShareBox (point) {
	var self = this;
	LExtends(self, LSprite, []);

	var hintTxt = new LTextField();
	hintTxt.text = "Share On";
	hintTxt.size = 25;
	hintTxt.color = "#FFFFFF";
	hintTxt.stroke = true;
	hintTxt.lineColor = "#000000";
	hintTxt.lineWidth = 2;
	self.addChild(hintTxt);

	var btnLayer = new LSprite();
	btnLayer.y = 40;
	self.addChild(btnLayer);

	var shareQZoneBtn = self.createBtn("icon_qzone", point, ShareUtils.Api.QZONE);
	btnLayer.addChild(shareQZoneBtn);
	
	var shareWeiboBtn = self.createBtn("icon_weibo", point, ShareUtils.Api.WEIBO);
	shareWeiboBtn.x = 80;
	btnLayer.addChild(shareWeiboBtn);

	hintTxt.x = (btnLayer.getWidth() - hintTxt.getWidth()) / 2;
}

ShareBox.ShareInfo = {
	URL : "",
	TITLE : "Flying Stone - Kick out birds with stones",
	PICTURE : "",
	CONTENT : "I got {point} in 'Flying Stone'. Come on and challenge me!!!"
};

ShareBox.prototype.createBtn = function (img, point, api) {
	var btn = new LSprite();

	var btnBmp = new LBitmap(new LBitmapData(dataList[img]));
	btn.addChild(btnBmp);

	btn.addEventListener(LMouseEvent.MOUSE_UP, function () {
		ShareUtils.share(api, {
			title : ShareBox.ShareInfo.TITLE,
			url : ShareBox.ShareInfo.URL,
			pic : ShareBox.ShareInfo.PICTURE,
			content : ShareBox.ShareInfo.CONTENT.replace("{point}", point)
		});
	});

	return btn;
};