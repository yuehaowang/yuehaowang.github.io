/**
 * Intro of wave data
 * 0	wave length		[0.6, 5.0]
 * 1	period 			[0.2, 2.0]
 * 2	amplitude 		[0.6, 3.0]
 * 3	delay  			[0, 6.0]
 * 4	origin 			1: left; -1: right
 * 5	initial dir 	1: up; -1: down
 * 6	available 		0: yes; 1: no
 */

function Wave (d) {
	var s = this;

	s.direction = d[4];
	s.A = d[2];
	s.T = d[1];
	s.wavelength = d[0];
	s.available = d[6];
	s.initDir = d[5];
	s.oscillators = new Array();
	s.numOscillatorInOneT = null;
	s.intervalBetweenTwoOscillators = null;
	s.numStartedOscillators = 0;
	s.preTime = null;

	s.addOscillator();
}

Wave.MIN_A = 0.6;
Wave.MIN_T = 0.2;
Wave.MIN_WAVELENGTH = 0.6;

Wave.MAX_A = 2.0;
Wave.MAX_T = 2.0;
Wave.MAX_WAVELENGTH = 5.0;

Wave.prototype.start = function () {
	this.preTime = (new Date()).getTime();
};

Wave.prototype.addOscillator = function () {
	var s = this, dx = 0.1;

	s.numOscillatorInOneT = s.wavelength / dx;
	s.intervalBetweenTwoOscillators = (s.T / s.numOscillatorInOneT) * TIME_SCALE;

	for (var i = 0; i < 130; i++) {
		var o = new Oscillator(s.A, s.T, s.initDir);
		o.x = i * dx;

		s.oscillators.push(o);
	}

	if (s.direction < 0) {
		s.oscillators.reverse();
	}

	if (s.intervalBetweenTwoOscillators < LGlobal.speed) {
		LGlobal.setFrameRate(s.intervalBetweenTwoOscillators);
	}
};

Wave.prototype.loop = function () {
	var s = this;

	if (s.available != 0) {
		return;
	} 

	if (s.preTime === null) {
		s.preTime = nowTime;

		return;
	}

	for (var i = 0, l = s.oscillators.length; i < l; i++) {
		s.oscillators[i].loop();
	}

	if (s.numStartedOscillators < s.oscillators.length) {
		var nowTime = (new Date()).getTime();

		if (nowTime - s.preTime >= s.intervalBetweenTwoOscillators) {
			s.oscillators[s.numStartedOscillators++].start();

			s.preTime = nowTime;
		}
	}
};

Wave.getNewWaveOscillators = function (w1, w2) {
	var res = new Array();

	for (var i = 0,  l = w1.oscillators.length; i < l; i++) {
		var decIndex = l - i - 1;

		var o1 = w1.oscillators[w1.direction < 0 ? decIndex : i],
			o2 = w2.oscillators[w2.direction < 0 ? decIndex : i];

		var no = new Oscillator();
		no.x = o1.x;
		no.y = o1.y + o2.y;

		res.push(no);
	}

	return res;
};