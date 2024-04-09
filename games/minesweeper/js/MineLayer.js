function MineLayer () {
	var s = this;
	LExtends(s, LSprite, []);

	s.map = new Array();
	s.waitingTime = 1;
	s.startTimer = false;
	s.timerIndex = 0;
	s.onUpCallback = null;
	s.preMouseButton = null;
	s.doubleDown = false;
	s.completeNum = 0;

	s.create();
	s.addEventListener(LEvent.ENTER_FRAME, s.loop);
}

MineLayer.prototype.create = function () {
	var s = this, positionList = new Array();

	for (var i = 0; i < blockYNum; i++) {
		var row = new Array();
		s.map.push(row);

		for (var j = 0; j < blockXNum; j++) {
			var btn = new ButtonTemplate();
			btn.x = j * 48;
			btn.y = i * 48;
			btn.positionInMap = {x : j, y : i};
			btn.isFlag = false;
			btn.isSwept = false;
			s.addChild(btn);
			btn.addEventListener(LMouseEvent.MOUSE_DOWN, function (e) {
				s.onDown(e.currentTarget, e.button);
			});
			btn.addEventListener(LMouseEvent.MOUSE_UP, function (e) {
				s.onUp(e.currentTarget, e.button);
			});

			row.push(0);
			positionList.push({x : j, y : i});
		}
	}

	for (var k = 0; k < mineNum; k++) {
		var mineIndex = Math.floor(Math.random() * positionList.length),
		o = positionList[mineIndex];

		s.map[o.y][o.x] = -1;

		positionList.splice(mineIndex, 1);
	}

	for (var m = 0; m < blockYNum; m++) {
		var row = s.map[m];

		for (var n = 0; n < blockXNum; n++) {
			var count = 0,
			list = null;

			if (row[n] == -1) {
				continue;
			}

			list = s.findBlockAround(n, m);

			for (var f = 0, ll = list.length; f < ll; f++) {
				if (list[f].v == -1) {
					count++;
				}
			}

			s.map[m][n] = count;
		}
	}
};

MineLayer.prototype.onDown = function (btn, mouseButton) {
	var s = this;

	s.parent.infoLayer.changeFace("surprise");

	if (
		s.startTimer
		&& (mouseButton == 0 || mouseButton == 2)
		&& mouseButton != s.preMouseButton
		&& !btn.isFlag
		&& btn.isSwept
	) {
		s.startTimer = false;
		s.timerIndex = 0;
		s.doubleDown = true;
		s.preMouseButton = mouseButton;
		
		if (!s.isMineAroundHasBeenSwept(btn)) {
			var p = btn.positionInMap,
			list = s.findBlockAround(p.x, p.y);

			for (var i = 0, l = list.length; i < l; i++) {
				var o = list[i], b = s.getChildAt(o.y * blockXNum + o.x)

				if (!b.isFlag) {
					b.setIntoOverState();
				}
			}
		}

		return;
	}

	s.startTimer = true;

	if (mouseButton == 0) {
		s.onUpCallback = function () {
			s.sweepThis(btn, true);
		}
	} else if (mouseButton == 2) {
		s.onUpCallback = function () {
			s.setFlagTo(btn);
		}
	}
};

MineLayer.prototype.onUp = function (btn, mouseButton) {
	var s = this, infoLayer = s.parent.infoLayer;

	infoLayer.changeFace("smile");

	if (s.doubleDown) {
		var p = btn.positionInMap,
		list = s.findBlockAround(p.x, p.y);

		s.doubleDown = false;
		s.startTimer = false;
		s.preMouseButton = null;

		if (s.isMineAroundHasBeenSwept(btn)) {
			s.sweepBlocksAround(btn);
		} else {
			for (var i = 0, l = list.length; i < l; i++) {
				var o = list[i], b = s.getChildAt(o.y * blockXNum + o.x);

				if (!b.isFlag) {
					b.setIntoNormalState();
				}
			}
		}

		return;
	}
	
	if (typeof s.onUpCallback == "function") {
		if (!infoLayer.isStart) {
			infoLayer.isStart = true;
			infoLayer.preTime = new Date().getTime();
		}

		s.onUpCallback();

		s.onUpCallback = null;
	}
};

MineLayer.prototype.loop = function (e) {
	var s = e.currentTarget;

	if (!s.startTimer) {
		return;
	}

	if (s.timerIndex++ > s.waitingTime) {
		s.timerIndex = 0;
		s.startTimer = false;
	}
};

MineLayer.prototype.sweepBlocksAround = function (btn) {
	var s = this,
	p = btn.positionInMap,
	list = s.findBlockAround(p.x, p.y);

	for (var i = 0, l = list.length; i < l; i++) {
		var  o = list[i], b = s.getChildAt(o.y * blockXNum + o.x);

		if (o.v >= 0 && !b.isSwept) {
			s.sweepThis(b);
		} else if (o.v == -1 && !b.isFlag) {
			s.sweepThis(b);
		}
	}
};

MineLayer.prototype.sweepThis = function (btn) {
	var s = this, p = btn.positionInMap, value = s.map[p.y][p.x];

	if (btn.isSwept) {
		return;
	}

	if (btn.isFlag) {
		s.setFlagTo(btn);
	}

	if (value == -1) {
		s.gameOver("lose");

		return;
	}

	var contentLayer = new LSprite();
	contentLayer.filters = [new LDropShadowFilter()];
	contentLayer.graphics.drawRect(2, "white", [0, 0, btn.getWidth(), btn.getHeight()], true, "lightgray");
	var txt = new LTextField();
	txt.text = (value == 0) ? "" : value;
	txt.x = (contentLayer.getWidth() - txt.getWidth()) / 2;
	txt.y = (contentLayer.getHeight() - txt.getHeight()) / 2;
	txt.weight = "bold";
	txt.color = "white";
	txt.lineColor = "#0088FF";
	txt.stroke = true;
	txt.lineWidth = 3;
	txt.size = 18;
	contentLayer.addChild(txt);

	btn.isSwept = true;

	btn.removeButton();

	btn.setContent(contentLayer);

	if (s.isMineAroundHasBeenSwept(btn)) {
		s.sweepBlocksAround(btn);
	}
};

MineLayer.prototype.findBlockAround = function (x, y) {
	var s = this,
	l = blockYNum,
	t = blockXNum,
	di = y + 1,
	ti = y - 1,
	ri = x + 1,
	li = x - 1,
	cr = null,
	rl = new Array();

	if (di < l) {
		cr = s.map[di];

		rl.push({x : x, y : di, v : cr[x]});

		if (li >= 0) {
			rl.push({x : li, y : di, v : cr[li]});
		}

		if (ri < t) {
			rl.push({x : ri, y : di, v : cr[ri]});
		}
	}

	if (ti >= 0) {
		cr = s.map[ti];

		rl.push({x : x, y : ti, v : cr[x]});

		if (li >= 0) {
			rl.push({x : li, y : ti, v : cr[li]});
		}

		if (ri < t) {
			rl.push({x : ri, y : ti, v : cr[ri]});
		}
	}

	if (li >= 0) {
		cr = s.map[y];

		rl.push({x : li, y : y, v : cr[li]});
	}

	if (ri < t) {
		cr = s.map[y];

		rl.push({x : ri, y : y, v : cr[ri]});
	}

	return rl;
};

MineLayer.prototype.setFlagTo = function (btn) {
	var s = this,
	p = btn.positionInMap;
	flagBmp = null,
	infoLayer = null;

	if (btn.isSwept) {
		return;
	}

	flagBmp = new LBitmap(new LBitmapData(dataList["flag"]));

	infoLayer = s.parent.infoLayer;

	if (btn.isFlag) {
		btn.isFlag = false;

		infoLayer.mineLeftNum++;

		if (s.map[p.y][p.x] == -1) {
			s.completeNum--;
		}

		btn.removeContent();
	} else {
		btn.isFlag = true;

		infoLayer.mineLeftNum--;

		if (s.map[p.y][p.x] == -1) {
			s.completeNum++;
		}

		btn.setContent(flagBmp);
	}

	infoLayer.refreshMineLeftNumTxt();

	if (s.completeNum == mineNum && infoLayer.mineLeftNum == 0) {
		for (var i = 0; i < blockYNum; i++) {
			for (var j = 0; j < blockXNum; j++) {
				var b = s.getChildAt(i * blockXNum + j);

				if (!b.isSwept && !b.isFlag) {
					s.sweepThis(b);
				}
			}
		}

		s.gameOver("win");
	}
};

MineLayer.prototype.isMineAroundHasBeenSwept = function (btn) {
	var s = this,
	p = btn.positionInMap,
	count = 0,
	value = s.map[p.y][p.x],
	list = null;

	if (value == 0) {
		return true;
	}

	list = s.findBlockAround(p.x, p.y);

	for (var i = 0, l = list.length; i < l; i++) {
		var o = list[i];

		if (s.getChildAt(o.y * blockXNum + o.x).isFlag) {
			count++;
		}
	}

	if (count == value) {
		return true;
	}

	return false;
};

MineLayer.prototype.gameOver = function (r) {
	var s = this, infoLayer = s.parent.infoLayer;

	for (var i = 0; i < blockYNum; i++) {
		var row = s.map[i];

		for (var j = 0; j < blockXNum; j++) {
			var v = row[j], b = s.getChildAt(i * blockXNum + j);

			b.mouseEnabled = false;
			b.mouseChildren = false;

			if (r == "lose" && v == -1) {
				b.setContent(new LBitmap(new LBitmapData(dataList["mine"])));

				infoLayer.changeFace("sad");
			}
		}
	}

	if (r == "win") {
		infoLayer.changeFace("happy");
	}

	infoLayer.isStart = false;
};