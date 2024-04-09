var MouseEvent = {
	isMouseDown : false,
	draggingObject : null,

	addEvents : function (canvasTag) {
		canvasTag.addEventListener("mousedown", function (e) {
			var mX = e.offsetX, mY = e.offsetY;

			if (MouseEvent.isMouseOnShapeCenter(shB, mX, mY)) {
				MouseEvent.draggingObject = shB;

				MouseEvent.isMouseDown = true;
			} else if (MouseEvent.isMouseOnShapeCenter(shA, mX, mY)) {
				MouseEvent.draggingObject = shA;

				MouseEvent.isMouseDown = true;
			}
		});
		canvasTag.addEventListener("mousemove", function (e) {
			if (MouseEvent.isMouseDown && MouseEvent.draggingObject) {
				MouseEvent.draggingObject.x = e.offsetX;
				MouseEvent.draggingObject.y = e.offsetY;

				SAT.testCollision(shA, shB);
			}
		});
		canvasTag.addEventListener("mouseup", function (e) {
			MouseEvent.isMouseDown = true;
			MouseEvent.draggingObject = null;
		});
	},

	isMouseOnShapeCenter : function (obj, mx, my) {
		var dx = mx - obj.x, dy = my - obj.y;

		return dx * dx + dy * dy < SHAPE_HANDLE_SIZE * SHAPE_HANDLE_SIZE;
	}
};