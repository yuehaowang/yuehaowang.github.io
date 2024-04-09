LInit(1000 / 30, "mylegend", 540, 640, main);

var dataList = {};
var stage;
var blockXNum = blockYNum = 10, mineNum = 12;

function main () {
	var loadData = [
		{path : "./js/InfoLayer.js"},
		{path : "./js/ButtonTemplate.js"},
		{path : "./js/MineLayer.js"},
		{path : "./js/StageLayer.js"},
		{name : "bg", path : "./images/bg.jpg"},
		{name : "button_sheet", path : "./images/button_sheet.png"},
		{name : "face_happy", path : "./images/face_happy.png"},
		{name : "face_sad", path : "./images/face_sad.png"},
		{name : "face_smile", path : "./images/face_smile.png"},
		{name : "face_surprise", path : "./images/face_surprise.png"},
		{name : "flag", path : "./images/flag.png"},
		{name : "mine", path : "./images/mine.png"}
	];

	var loadingLayer = new LoadingSample1();
	addChild(loadingLayer);

	LLoadManage.load(
		loadData,
		function (p) {
			loadingLayer.setProgress(p);
		},
		function (r) {
			dataList = r;

			loadingLayer.remove();

			initGame();
		}
	);
}

function initGame () {
	stage = new StageLayer();
	addChild(stage);
}
