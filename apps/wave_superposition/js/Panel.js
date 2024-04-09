function Panel (title) {
	var s = this;
	LExtends(s, LSprite, []);

	var widget;
	
	widget = Panel.createRange("Wavelength (λ): ", Wave.MIN_WAVELENGTH, Wave.MAX_WAVELENGTH, "m");
	s.addChild(widget);
	s.wavelengthRange = widget.range;

	widget = Panel.createRange("Period (T): ", Wave.MIN_T, Wave.MAX_T, "s");
	s.addChild(widget);
	s.periodRange = widget.range;
	widget = Panel.createRange("Amplitude (A): ", Wave.MIN_A, Wave.MAX_A, "m");
	s.addChild(widget);
	s.amplitudeRange = widget.range;

	widget = Panel.createRange("Delay: ", 0, Wave.MAX_T * 3, "s");
	s.addChild(widget);
	s.delayRange = widget.range;

	widget = Panel.createRadio("Origin: ", [{label : "Left", value : 1}, {label : "Right", value : -1}]);
	s.addChild(widget);
	s.originRadio = widget.radio;

	widget = Panel.createRadio("Initial Direction: ", [{label : "Up", value : 1}, {label : "Down", value : -1}]);
	s.addChild(widget);
	s.initDirRadio = widget.radio;

	widget = Panel.createRadio("Available: ", [{label : "Yes", value : 0}, {label : "No", value : 1}]);
	s.addChild(widget);
	s.availableRadio = widget.radio;

	for (var i = 0, preObj = null; i < s.numChildren; i++) {
		var o = s.getChildAt(i);

		if (o) {
			if (preObj) {
				o.y = preObj.getHeight() + preObj.y + 10;
			}

			preObj = o;
		}
	}
}

Panel.prototype.setAll = function (settings) {
	var s = this;

	s.wavelengthRange.setValue(settings[0]);
	s.periodRange.setValue(settings[1]);
	s.amplitudeRange.setValue(settings[2]);
	s.delayRange.setValue(settings[3]);
	s.originRadio.setValue(settings[4]);
	s.initDirRadio.setValue(settings[5]);
	s.availableRadio.setValue(settings[6]);
};

Panel.prototype.getAll = function () {
	var s = this;

	return [
		s.wavelengthRange.getValue(),
		s.periodRange.getValue(),
		s.amplitudeRange.getValue(),
		s.delayRange.getValue(),
		s.originRadio.value,
		s.initDirRadio.value,
		s.availableRadio.value
	];
};

Panel.createRange = function (hint, min, max, unit) {
	var txt, range, valTxt, len = max - min;

	var layer = new LSprite();

	txt = new LTextField();
	txt.text = hint;
	txt.size = 15;
	layer.addChild(txt);

	range = new LRange(200);
	range.x = txt.getWidth() + 10;
	layer.addChild(range);

	valTxt = new LTextField();
	valTxt.x = range.x + 210;
	valTxt.y = 3;
	valTxt.size = 12;
	layer.addChild(valTxt);

	layer.range = range;

	range._setValue_ = range.setValue;
	range.setValue = function (v) {
		range._setValue_(v * 100);

		valTxt.text =  range.getValue().toFixed(1) + unit;
	};

	range.getValue = function () {
		return parseFloat(range.value * 0.01 * len + min);
	};

	range.addEventListener(LRange.ON_CHANGE, function () {
		valTxt.text = range.getValue().toFixed(1) + unit;
	});

	return layer;
};

Panel.createRadio = function (hint, list) {
	var txt, radio;

	var layer = new LSprite();

	txt = new LTextField();
	txt.text = hint;
	txt.size = 15;
	layer.addChild(txt);

	radio = new LRadio();
	radio.x = txt.getWidth() + 30;
	layer.addChild(radio);

	layer.radio = radio;

	for (var i = 0, l = list.length; i < l; i++) {
		var item = list[i];

		var radioChild = new LRadioChild(item.value);
		radioChild.x = i * 100;
		radioChild.y = 10;
		radio.push(radioChild);

		var valTxt = new LTextField();
		valTxt.x = 20;
		valTxt.y = -10;
		valTxt.size = 15;
		valTxt.text = item.label;
		radioChild.addChild(valTxt);
	}

	return layer;
};