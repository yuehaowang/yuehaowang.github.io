function RoundButton (label, r, textSize) {
	var self = this;
	LExtends(self, LSprite, []);

	var btnBg = new LShape();
	btnBg.alpha = 0.7;
	btnBg.graphics.drawArc(4, "#FFFFFF", [r, r, r, 0, Math.PI * 2], true, "#333333");
	self.addChild(btnBg);

	var txt = new LTextField();
	txt.text = label;
	txt.size = textSize;
	txt.weight = "bold";
	txt.textAlign = "center";
	txt.textBaseline = "middle";
	txt.x = txt.y = r;
	txt.color = "#FF7F00";
	txt.lineColor = "#000000";
	txt.lineWidth = 8;
	txt.stroke = true;
	self.addChild(txt);
}