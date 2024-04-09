function Polygon (list) {
	this.objectIndex = Renderer.objectIndex++;
	this.type = "polygon";
	this.vertices = list;
	this.x = 0;
	this.y = 0;
	this.color = "#333333";
}

Polygon.prototype = {
	getRootCoordinate : function () {
		var list = this.vertices, res = new Array();

		for (var i = 0, l = list.length; i < l; i++) {
			var coord = list[i];

			res.push(new Vec2(coord.x + this.x, coord.y + this.y));
		}

		return res;
	},

	draw : function (c) {
		var list = this.vertices;

		if (list.length <= 1) {
			return;
		}

		c.moveTo(list[0].x, list[0].y);

		for (var i = 1, l = list.length; i < l; i++) {
			var coord = list[i];

			c.lineTo(coord.x, coord.y);
		}

		c.closePath();
	},

	getSides : function () {
		var list = this.vertices,
			l = list.length,
			res = new Array();

		if (l >= 3) {
			for (var j = 1, pre = list[0]; j < l; j++) {
				var p = list[j];

				res.push(Vec2.substract(p, pre));

				pre = p;
			}

			res.push(Vec2.substract(list[0], list[l - 1]));
		}

		return res;
	},

	getProjection : function (axis) {
		var list = this.getRootCoordinate(), min = null, max = null;

		for (var i = 0, l = list.length; i < l; i++) {
			var p = list[i];

			var pro = Vec2.dot(p, axis) / axis.length();

			if (min === null || pro < min) {
				min = pro;
			}

			if (max === null || pro > max) {
				max = pro;
			}
		}

		return {min : min, max : max};
	},

	getNearestPoint : function (p1) {
		var list = this.getRootCoordinate(), rP = list[0], minDis = Vec2.distance(p1, rP);

		for (var i = 1, l = list.length; i < l; i++) {
			var p2 = list[i], d = Vec2.distance(p1, p2);

			if (d < minDis) {
				minDis = d;

				rP = p2;
			}
		}

		return rP;
	}
};