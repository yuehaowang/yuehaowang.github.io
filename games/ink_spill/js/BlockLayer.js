function BlockLayer (col, row) {
	var self = this;
	LExtends(self, LSprite, []);

	self.row = row;
	self.col = col;

	self.spilledList = new Array();

	self.completionRate = 0;

	self.createBlocks();
}

BlockLayer.prototype.createBlocks = function () {
	var self = this, marginRight = 5;

	for (var i = 0, n = self.row * self.col; i < n; i++) {
		var rowIndex = Math.floor(i / self.col);

		var b = new Block(i, Math.floor(Math.random() * Block.COLOR_LIST.length));
		b.y = rowIndex * (Block.HEIGHT + marginRight);
		b.x = (i - rowIndex * self.col) * (Block.WIDTH + marginRight);
		self.addChild(b);
	}

	self.spilledList = self.findIdenticalBlocks(self.getChildAt(0).colorIndex, 0, 0);

	self.completionRate = self.spilledList.length / (self.col * self.row);
};

BlockLayer.prototype.startSpilling = function (selectedColorIndex, onComplete) {
	var self = this, spilledBlockNum, tweenIndex = 0;

	if (!onComplete) {
		onComplete = function () {};
	}

	for (var i = 0, n = self.spilledList.length; i < n; i++) {
		self.spilledList[i].colorIndex = selectedColorIndex;
	}

	for (var j = 0, l = self.numChildren; j < l; j++) {
		var b = self.getChildAt(j);

		if (b) {
			b.checked = false;
		}
	}

	self.spilledList = self.findIdenticalBlocks(selectedColorIndex, 0, 0);

	spilledBlockNum = self.spilledList.length;

	self.completionRate = spilledBlockNum / (self.col * self.row);

	for (var k = 0; k < spilledBlockNum; k++) {
		var b = self.spilledList[k];

		b.changeColor(selectedColorIndex, false, function () {
			if (++tweenIndex >= spilledBlockNum) {
				onComplete();
			}
		});
	}
};

BlockLayer.prototype.findIdenticalBlocks = function (colorIndex, col, row) {
	var self = this, resultList = new Array();

	var currentIndex = self.getBlockIndexByColAndRow(col, row),
		current = self.getChildAt(currentIndex);
	
	if (current && !current.checked && current.colorIndex == colorIndex) {
		current.checked = true;

		resultList.push(current);

		resultList = resultList.concat(self.findIdenticalBlocks(colorIndex, col, row - 1));
		resultList = resultList.concat(self.findIdenticalBlocks(colorIndex, col, row + 1));
		resultList = resultList.concat(self.findIdenticalBlocks(colorIndex, col - 1, row));
		resultList = resultList.concat(self.findIdenticalBlocks(colorIndex, col + 1, row));
	}

	return resultList;
};

BlockLayer.prototype.getBlockIndexByColAndRow = function (col, row) {
	var self = this;

	if (col < 0 || col >= self.col || row < 0 || row >= self.row) {
		return -1;
	}

	return self.col * row + col;
};

BlockLayer.prototype.blinkOutAllBlocks = function (onComplete) {
	var self = this, len = self.numChildren, finishedNum = 0;

	if (!onComplete) {
		onComplete = function () {};
	}

	for (var i = 0; i < len; i++) {
		var b = self.getChildAt(i);

		if (!b) {
			continue;
		}

		b.blinkOut(function () {
			if (++finishedNum >= len) {
				onComplete();
			}
		});
	}
};