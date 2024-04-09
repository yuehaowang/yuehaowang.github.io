function Renderer (canvas) {
	this.canvas = canvas;
	this.displayList = new Array();
}

Renderer.objectIndex = 0;

Renderer.prototype = {
	loopDraw : function () {
		var c = this.canvas;

		c.fillStyle = "#EEEEEE";
		c.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		
		for (var i = 0, l = this.displayList.length; i < l; i++) {
			var o = this.displayList[i];

			c.save();
			c.translate(o.x, o.y);

			c.beginPath();
			c.globalAlpha = 0.6;
			c.arc(0, 0, SHAPE_HANDLE_SIZE, 0, Math.PI * 2);
			c.fillStyle = "#0000FF";
			c.fill();

			c.beginPath();
			c.globalAlpha = 1;

			o.draw(c);

			c.strokeStyle = o.color;
			c.lineWidth = 2;
			c.stroke();
			c.restore();
		}
	},

	add : function (o) {
		this.displayList.push(o);
	},

	remove : function (o) {
		for (var i = 0, l = this.displayList.length; i < l; i++) {
			var child = this.displayList[i];

			if (child.objectIndex == o.objectIndex) {
				this.displayList.splice(i, 1);

				break;
			}
		}
	}
};