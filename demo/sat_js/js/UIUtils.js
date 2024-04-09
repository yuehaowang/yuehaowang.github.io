var UIUtils = {
	createSelect : function () {
		var selection = [
			"Circle",
			"Triangle",
			"Square",
			"Pentagon",
			"Hexagon",
			"Heptagon",
			"Octagon",
			"Nonagon",
			"Decagon",
			"Hendecagon",
			"Dodecagon"
		];

		for (var i = 0; i < 2; i++) {
			var labelTxt, initialValue, id;

			if (i == 0) {
				labelTxt = "Shape A: ";
				initialValue = 3;
				id = "shA-select";
			} else if (i == 1) {
				labelTxt = "Shape B: ";
				initialValue = 0;
				id = "shB-select";
			}

			var label = document.createElement("b");
			label.innerHTML = labelTxt;
			document.getElementById("select-box").appendChild(label);

			var select = document.createElement("select");
			select.id = id;
			document.getElementById("select-box").appendChild(select);

			for (var j = 0; j < selection.length; j++) {
				var option = document.createElement("option");
				option.innerHTML = selection[j];
				option.value = j;
				select.appendChild(option);
			}

			select.value = initialValue;

			select.onchange = function () {
				var id = this.id;

				if (id == "shA-select") {
					renderer.remove(shA);

					shA = UIUtils.createShape(shA.x, shA.y, id);
					renderer.add(shA);
				} else {
					renderer.remove(shB);

					shB = UIUtils.createShape(shB.x, shB.y, id);
					renderer.add(shB);
				}

				SAT.testCollision(shA, shB);
			};
		}
	},

	createShape : function (x, y, id) {
		var obj, sh = UIUtils.getShape(id);

		if (sh == -1) {
			obj = new Circle(SHAPE_SIZE);
		} else {
			obj = new Polygon(getPolygonVertices(sh, SHAPE_SIZE));
		}

		obj.x = x;
		obj.y = y;

		return obj;
	},

	getShape : function (id) {
		var v = Number(document.getElementById(id).value);

		return (v == 0) ? -1 : (v + 2);
	}
}