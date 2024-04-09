function LoadingBar () {
	var self = this;
	LExtends(self, LSprite, []);

	var bgShape = new LShape();
	bgShape.graphics.drawRect(0, "", [0, 0, LGlobal.width, LGlobal.height], true, "#222222");
	bgShape.cacheAsBitmap(true);
	self.addChild(bgShape);

	var loadingTxt = new LTextField();
	loadingTxt.text = "Loading...";
	loadingTxt.size = 30;
	loadingTxt.color = "#FFFFFF";
	loadingTxt.stroke = true;
	loadingTxt.lineWidth = 2;
	loadingTxt.lineColor = "#F92672";
	loadingTxt.textAlign = "center";
	loadingTxt.x = LGlobal.width / 2;
	loadingTxt.y = LGlobal.height * 0.3;
	self.addChild(loadingTxt);

	self.spinnerLayer = new LSprite();
	self.spinnerLayer.x = LGlobal.width / 2;
	self.spinnerLayer.y = loadingTxt.y + 170;
	self.addChild(self.spinnerLayer);

	self.createCircles();

	self.addEventListener(LEvent.ENTER_FRAME, self.loop);
}

LoadingBar.prototype.createCircles = function () {
	var self = this, R = 50, r = 25, n = 9, a = Math.PI * 2 / n, deltaAlpha = 0.1;

	var cl = ["#F92672", "#87E22E", "#54D9EF", "#FD9720"];

	for (var i = 0; i < n; i++) {
		var cx = R * Math.cos(i * a),
			cy = R * Math.sin(i * a),
			color = cl[Math.floor(Math.random() * cl.length)];

		var circleSh = new LShape();
		circleSh.alpha = 1 - i * deltaAlpha;
		circleSh.x = cx;
		circleSh.y = cy + 20;
		circleSh.graphics.drawArc(0, "", [0, 0, r, 0, Math.PI * 2], true, color);
		self.spinnerLayer.addChild(circleSh);
	}
};

LoadingBar.prototype.loop = function (e) {
	var self = e.currentTarget;

	self.spinnerLayer.rotate += 3;
};