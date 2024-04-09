function RoundButton (icon) {
	var self = this;
	LExtends(self, LSprite, []);

	self.createBtn(icon);
}

RoundButton.ICON_SIZE = 48;
RoundButton.BUTTON_WIDTH = 128;
RoundButton.BUTTON_HEIGHT = 108;

RoundButton.prototype.createBtn = function (iconName) {
	var self = this, icon, margin = 20;

	if (iconName == "replay") {
		icon = RoundButton.getReplayIcon().clone();
	} else if (iconName == "back") {
		icon = RoundButton.getBackIcon();
	} else if (iconName == "play") {
		icon = RoundButton.getPlayIcon();
	}

	icon.x = (RoundButton.BUTTON_WIDTH - RoundButton.ICON_SIZE) / 2;
	icon.y = (RoundButton.BUTTON_HEIGHT - RoundButton.ICON_SIZE) / 2;

	self.addChild(icon);

	self.graphics.drawRoundRect(0, "", [0, 0, RoundButton.BUTTON_WIDTH, RoundButton.BUTTON_HEIGHT, 15], true, "#3A3A3A");

	self.filters = [new LDropShadowFilter(1, 1, "#555555", 15)];
};

RoundButton.getReplayIcon = function () {
	var size = RoundButton.ICON_SIZE;

	var icon = new LShape();
	icon.filters = [new LDropShadowFilter(1, 1, "#E6DB74", 7)];
	icon.graphics.add(function () {
		var c = LGlobal.canvas;

		c.lineCap = "round";
		c.lineJoin = "round";
		c.lineWidth = 8;
		c.strokeStyle = "#E6DB74";

		c.beginPath();
		c.moveTo(0, 0);
		c.lineTo(size, 0);
		c.lineTo(size, size);
		c.lineTo(0, size);
		c.lineTo(0, size * 0.4);
		c.stroke();

		c.beginPath();
		c.moveTo(0, size * 0.4);
		c.lineTo(-size * 0.2, size * 0.6);
		c.stroke();
		c.beginPath();
		c.moveTo(0, size * 0.4);
		c.lineTo(size * 0.2, size * 0.6);
		c.stroke();
	});

	return icon;
};

RoundButton.getBackIcon = function () {
	var size = RoundButton.ICON_SIZE;

	var icon = new LShape();
	icon.filters = [new LDropShadowFilter(1, 1, "#FD9720", 7)];
	icon.graphics.add(function () {
		var c = LGlobal.canvas;

		c.lineCap = "round";
		c.lineJoin = "round";
		c.lineWidth = 8;
		c.strokeStyle = "#FD9720";

		c.beginPath();
		c.moveTo(size, 0);
		c.lineTo(0, 0);
		c.lineTo(0, size);
		c.lineTo(size, size);
		c.stroke();

		c.beginPath();
		c.moveTo(size * 0.2, size * 0.5);
		c.lineTo(size, size * 0.5);
		c.stroke();

		c.beginPath();
		c.moveTo(size, size * 0.5);
		c.lineTo(size * 0.8, size * 0.3);
		c.stroke();
		c.beginPath();
		c.moveTo(size, size * 0.5);
		c.lineTo(size * 0.8, size * 0.7);
		c.stroke();
	});

	return icon;
};

RoundButton.getPlayIcon = function () {
	var size = RoundButton.ICON_SIZE;

	var icon = new LShape();
	icon.filters = [new LDropShadowFilter(1, 1, "#F92672", 7)];
	icon.graphics.add(function () {
		var c = LGlobal.canvas;

		c.lineJoin = "round";
		c.lineWidth = 8;
		c.strokeStyle = "#F92672";
		c.fillStyle = "#F92672";

		c.beginPath();
		c.moveTo(0, 0);
		c.lineTo(size, size * 0.5);
		c.lineTo(0, size);
		c.closePath();
		c.stroke();
		c.fill();
	});

	return icon;
};