function CountdownTimer (time, format) {
	var self = this;
	LExtends(self, LSprite, []);

	if (!format) {
		format = {};
	}

	self.unit = "s";

	if (format.noUnit) {
		self.unit = "";
	}

	self.initTime = time;
	self.currentTime = time;

	self.timeTxt = new LTextField();
	self.timeTxt.text = time + self.unit;
	self.timeTxt.size = format.size || 30;
	self.timeTxt.color = "#FFFFFF";
	self.timeTxt.textAlign = format.textAlign || "center";
	self.timeTxt.textBaseline = format.textBaseline || "top";
	self.timeTxt.stroke = format.stroke || false;
	self.timeTxt.lineColor = format.lineColor || "#000000";
	self.timeTxt.lineWidth = format.lineWidth || 3;
	self.timeTxt.weight = format.weight || "normal";
	self.addChild(self.timeTxt);

	self.timer = new LTimer(1000, time);
	self.timer.addEventListener(LTimerEvent.TIMER, function () {
		self.tick();
	});
	self.timer.addEventListener(LTimerEvent.TIMER_COMPLETE, function () {
		self.dispatchEvent(CountdownTimer.EVENT_TIME_UP);
	});
}

CountdownTimer.EVENT_TIME_UP = "event_time_up";

CountdownTimer.prototype.tick = function () {
	var self = this;

	self.timeTxt.text = --self.currentTime + self.unit;
};

CountdownTimer.prototype.setPause = function (b) {
	var self = this;

	if (b) {
		self.timer.stop();
	} else {
		self.timer.start();
	}
};

CountdownTimer.prototype.getUsedTime = function () {
	var self = this;
	
	return self.initTime - self.currentTime;
};