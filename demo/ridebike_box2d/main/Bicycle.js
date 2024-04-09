/**
 *Bicycle.js

 * @param sx 自行车起始x坐标
 * @param sy 自行车起始y坐标
*/
function Bicycle(sx,sy){
	var s = this;
	base(s,LSprite,[]);

	/**初始坐标*/
	s.sx = sx;
	s.sy = sy;

	/**刚体所属LSprite对象列表*/
	s.bodyList = new Array();

	/**添加左右移动力度向量*/
	s.moveVec = new LStage.box2d.b2Vec2();
	/**添加拉压操作力度向量*/
	s.tcVec = new LStage.box2d.b2Vec2();

	/**添加事件*/
	//键盘按下事件
	LEvent.addEventListener(window,LKeyboardEvent.KEY_DOWN,function(e){
		if(world.gameOverController)return;
		s.onKeydown(e,s);
	});
	//键盘松开事件
	LEvent.addEventListener(window,LKeyboardEvent.KEY_UP,function(e){
		s.onKeyup(e,s);
	});

	//初始化
	s.init();
}
Bicycle.prototype.onKeydown = function(e,s){
	var force = 50;
	switch(e.keyCode){
		//向右
		case 39:
			s.moveVec.x = force;
			break;
		//向左
		case 37:
			s.moveVec.x = -force;
			break;
		//向上
		case 38:
			s.tcVec.y = -force;
			break;
		//向下
		case 40:
			s.tcVec.y = force;
			break;
		default:
			return;
	}
	/**施加移动的力*/
	s.mainBody.ApplyForce(s.moveVec,s.mainBody.GetWorldCenter());
	/**施加拉压的力*/
	s.tcBody.ApplyForce(s.tcVec,s.tcBody.GetWorldCenter());
};
Bicycle.prototype.onKeyup = function(e,s){
	/**清空力度相量*/
	s.moveVec.SetZero();
	s.tcVec.SetZero();
};
Bicycle.prototype.init = function(){
	var s = this;

	var sx = s.sx;
	var sy = s.sy; 

	/**轮子半径*/
	var wheelR = 20;
	/**轮子之间的距离*/
	var gapBetweenWheelAndWheel = 100;
	/**车手柄到轮子的距离*/
	var gapBetweenWheelAndHandlebar = 50;
	/**车把尺寸*/
	var handlebarWidth=20,handlebarHeight=5;
	/**座椅到轮子支架的距离*/
	var gapBetweenWheelFrameAndSeat = 30;
	/**座椅尺寸*/
	var seatWidth=30,seatHeight=5;
	/**支架尺寸*/
	var frameSize = 10;

	/**加入支架*/
	//轮子上的支架
	var frameAObj = new LSprite();
	frameAObj.x = sx+gapBetweenWheelAndWheel/2;
	frameAObj.y = sy+frameSize/2;
	frameAObj.addBodyPolygon(gapBetweenWheelAndWheel,frameSize,1,5);
	world.addChild(frameAObj);
	s.bodyList.push(frameAObj);
	//车把到轮子的支架
	var frameBObj = new LSprite();
	frameBObj.trigger="destroy_bicycle";
	frameBObj.x = sx+gapBetweenWheelAndWheel-frameSize/2;
	frameBObj.y = sy-gapBetweenWheelAndHandlebar/2;
	frameBObj.addBodyPolygon(frameSize,gapBetweenWheelAndHandlebar,1,2);
	world.addChild(frameBObj);
	s.bodyList.push(frameBObj);

	/**加入车把*/
	var handlebarObj = new LSprite();
	handlebarObj.trigger="destroy_bicycle";
	handlebarObj.x = sx+gapBetweenWheelAndWheel-handlebarWidth/2-frameSize;
	handlebarObj.y = sy-gapBetweenWheelAndHandlebar+handlebarHeight/2;
	handlebarObj.addBodyPolygon(handlebarWidth,handlebarHeight,1,.5);
	world.addChild(handlebarObj);
	s.bodyList.push(handlebarObj);

	/**加入座椅*/
	//座椅到轮子支架的支架
	var seatFrameObj = new LSprite();
	seatFrameObj.x = sx+30;
	seatFrameObj.y = sy-gapBetweenWheelFrameAndSeat/2;
	seatFrameObj.addBodyPolygon(frameSize,gapBetweenWheelFrameAndSeat,1,1);
	world.addChild(seatFrameObj);
	s.bodyList.push(seatFrameObj);
	//座椅
	var seatObj = new LSprite();
	seatObj.trigger="destroy_bicycle";
	seatObj.x = sx+30;
	seatObj.y = sy-gapBetweenWheelFrameAndSeat-seatHeight/2;
	seatObj.addBodyPolygon(seatWidth,seatHeight,1,.5);
	world.addChild(seatObj);
	s.bodyList.push(seatObj);

	/**加入轮子*/
	//左边轮子A
	var wheelAObj = new LSprite();
	wheelAObj.x = sx-wheelR;
	wheelAObj.y = sy;
	wheelAObj.addBodyCircle(wheelR,wheelR,wheelR,1,2.5,.2,.4);
	world.addChild(wheelAObj);
	s.bodyList.push(wheelAObj);
	//右边轮子B
	var wheelBObj = new LSprite();
	wheelBObj.x = sx+gapBetweenWheelAndWheel-wheelR;
	wheelBObj.y = sy;
	wheelBObj.addBodyCircle(wheelR,wheelR,wheelR,1,2.5,.2,.4);
	world.addChild(wheelBObj);
	s.bodyList.push(wheelBObj);
	
	/**添加关节*/
	//轮子A和轮子支架的旋转关节
	world.jointList.push(LStage.box2d.setRevoluteJoint(frameAObj.box2dBody, wheelAObj.box2dBody));
	//轮子B和轮子支架的旋转关节
	world.jointList.push(LStage.box2d.setRevoluteJoint(frameAObj.box2dBody, wheelBObj.box2dBody));
	//车把到轮子的支架和轮子支架的焊接关节
	world.jointList.push(LStage.box2d.setWeldJoint(frameAObj.box2dBody, frameBObj.box2dBody));
	//车把到轮子的支架和车把的焊接关节
	world.jointList.push(LStage.box2d.setWeldJoint(handlebarObj.box2dBody, frameBObj.box2dBody));
	//轮子的支架和座椅的焊接关节
	world.jointList.push(LStage.box2d.setWeldJoint(seatFrameObj.box2dBody, frameAObj.box2dBody));
	//座椅的支架和座椅的焊接关节
	world.jointList.push(LStage.box2d.setWeldJoint(seatFrameObj.box2dBody, seatObj.box2dBody));
	
	/**遍历所有自行车零件刚体*/
	for(var key in s.bodyList){
		var obj = s.bodyList[key];
		//加入鼠标拖动
		if(obj.box2dBody)obj.setBodyMouseJoint(true);
		//设置对象名称
		obj.name = "bicycle";
	}

	/**设置主刚体*/
	s.mainBody = frameAObj.box2dBody;
	/**设置拉压操作刚体*/
	s.tcBody = wheelBObj.box2dBody;
};