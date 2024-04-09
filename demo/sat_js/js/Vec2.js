function Vec2 (x, y) {
	this.x = x;
	this.y = y;
}

Vec2.distance = function (v1, v2) {
	var dx = v1.x - v2.x,
		dy = v1.y - v2.y;
		
	return Math.sqrt(dx * dx + dy * dy);
};

Vec2.add = function (v1, v2) {
	return new Vec2(v1.x + v2.x, v1.y + v2.y);
};

Vec2.substract = function (v1, v2) {
	return new Vec2(v1.x - v2.x, v1.y - v2.y);
};

Vec2.dot = function (v1, v2) {
	return v1.x * v2.x + v1.y * v2.y;
};

Vec2.prototype = {
	length : function () {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},

	normalize : function () {
		var l = this.length();

		return new Vec2(this.x / l, this.y / l);
	},

	normL : function () {
		return new Vec2(this.y, -this.x);
	}
};