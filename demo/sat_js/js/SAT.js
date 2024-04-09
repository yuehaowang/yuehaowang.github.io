var SAT = (function () {
	function testCollision (A, B) {
		var res, color = "#333333";

		if (A.type == "polygon" && B.type == "polygon") {
			res = polygonsCollisionTest(A, B);
		} else if (A.type == "circle" && B.type == "circle") {
			res = circlesCollisionTest(A, B);
		} else {
			var c, p;
			if (A.type == "circle") {
				c = A;
				p = B;
			} else {
				c = B;
				p = A;
			}

			res = circlePolygonCollisionTest(c, p);
		}

		if (res) {
			color = "#FF0000";
		}

		A.color = B.color = color;
	}

	function polygonsCollisionTest (a, b) {
		var sides = a.getSides().concat(b.getSides()), axises = new Array();

		for (var j = 0, l = sides.length; j < l; j++) {
			axises.push(sides[j].normL());
		}

		for (var i = 0, len = axises.length; i < len; i++) {
			var axis = axises[i];

			var proA = a.getProjection(axis),
				proB = b.getProjection(axis);

			if (isOverlay(proA, proB)) {
				return false;
			}
		}

		return true;
	}

	function circlesCollisionTest (a, b) {
		var axis = new Vec2(a.x - b.x, a.y - b.y);

		var proA = a.getProjection(axis),
			proB = b.getProjection(axis);

		if (isOverlay(proA, proB)) {
			return false;
		}

		return true;
	}

	function circlePolygonCollisionTest (c, p) {
		var sides = p.getSides(), axises = new Array();

		for (var j = 0, l = sides.length; j < l; j++) {
			axises.push(sides[j].normL());
		}

		var p1 = p.getNearestPoint(new Vec2(c.x, c.y));

		axises.push(new Vec2(p1.x - c.x, p1.y - c.y));

		for (var i = 0, len = axises.length; i < len; i++) {
			var axis = axises[i];

			var proA = c.getProjection(axis),
				proB = p.getProjection(axis);

			if (isOverlay(proA, proB)) {
				return false;
			}
		}

		return true;
	}

	function isOverlay (proA, proB) {
		if (proA.min < proB.min) {
			min = proA.min;
		} else {
			min = proB.min;
		}

		if (proA.max > proB.max) {
			max = proA.max;
		} else {
			max = proB.max;
		}

		return (proA.max - proA.min) + (proB.max - proB.min) < max - min;
	}


	return {
		testCollision : testCollision
	};
})();