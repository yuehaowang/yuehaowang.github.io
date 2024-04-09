function Circle (r) {
	this.objectIndex = Renderer.objectIndex++;
	this.type = "circle";
	this.r = r;
	this.x = 0;
	this.y = 0;
	this.color = "#333333";
}

Circle.prototype = {
	draw : function (c) {
		c.arc(0, 0, this.r, 0, Math.PI * 2);
	},

	getProjection : function (axis) {
		var pro = Vec2.dot(new Vec2(this.x, this.y), axis) / axis.length();

		return {min : pro - this.r, max : pro + this.r};
	}
};