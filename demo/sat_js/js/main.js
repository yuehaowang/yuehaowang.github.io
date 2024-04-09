var SHAPE_SIZE = 80, SHAPE_HANDLE_SIZE = 10;
var CANVAS_WIDTH, CANVAS_HEIGHT;

var renderer;
var shA = null, shB = null;

window.onload = function () {
	var canvasTag = document.getElementById("mycanvas");
	var canvas = canvasTag.getContext("2d");

	CANVAS_WIDTH = canvasTag.width;
	CANVAS_HEIGHT = canvasTag.height;

	renderer = new Renderer(canvas);

	setInterval(function () {
		renderer.loopDraw();
	}, 30);

	MouseEvent.addEvents(canvasTag);

	main();
};

function main () {
	UIUtils.createSelect();

	shA = UIUtils.createShape(150, 250, "shA-select");
	renderer.add(shA);

	shB = UIUtils.createShape(540, 250, "shB-select");
	renderer.add(shB);
}

function getPolygonVertices (edges, r) {  
	var ca = 0, aiv = 360 / edges, ata = Math.PI / 180, list = new Array();

	for (var k = 0; k < edges; k++) {
		var x = Math.cos(ca * ata) * r,
			y = Math.sin(ca * ata) * r;

		list.push(new Vec2(x, y));

		ca += aiv;
	}

	return list;
}