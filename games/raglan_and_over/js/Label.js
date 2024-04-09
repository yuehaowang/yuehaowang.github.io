function Label (isLight) {
	var s = this;
	LExtends(s, LTextField, []);

	s.font = "Open Sans" + (isLight ? " light" : "");
	s.scaleY = 1.2;
}