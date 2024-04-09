/**
 *Main.js
*/
function Main(){
	var s = this;
	base(s,LSprite,[]);
	s.type="Main";

	/**设置场景大小*/
	s.sceneWidth = 8500;
	s.sceneHeight = LStage.height+1000;

	/**关节列表*/
	s.jointList = new Array();
	/**游戏结束控制器*/
	s.gameOverController = false;
}
Main.prototype.init = function(){
	var s = this;

	/**加入边框*/
	s.addBorder();
	/**加入路面*/
	s.addRoad();
	/**加入自行车*/
	s.addBicycle();
	/**加入河流*/
	//s.addRiver();
	/**加入刚体碰撞事件*/
	LStage.box2d.setEvent(LEvent.POST_SOLV,s.postSolve);
	/**加入循环事件*/
	s.addEventListener(LEvent.ENTER_FRAME,s.loop);
};
Main.prototype.addBorder = function(){
	var s = this;

	/**创建边框*/
	//设置边框尺寸
	var borderSize = 10;
	//顶部边框
	var topBorder = new LSprite();
	topBorder.x = s.sceneWidth/2;
	topBorder.y = 5;
	topBorder.addBodyPolygon(s.sceneWidth,borderSize,0);
	s.addChild(topBorder);
	//右部边框
	var rightBorder = new LSprite();
	rightBorder.x = s.sceneWidth-5;
	rightBorder.y = s.sceneHeight/2;
	rightBorder.addBodyPolygon(borderSize,s.sceneHeight,0);
	s.addChild(rightBorder);
	//底部边框
	var bottomBorder = new LSprite();
	bottomBorder.name = "wall";
	bottomBorder.x = s.sceneWidth/2;
	bottomBorder.y = s.sceneHeight-5;
	bottomBorder.addBodyPolygon(s.sceneWidth,borderSize,0);
	s.addChild(bottomBorder);
	//左部边框
	var leftBorder = new LSprite();
	leftBorder.x = 5;
	leftBorder.y = s.sceneHeight/2;
	leftBorder.addBodyPolygon(borderSize,s.sceneHeight,0);
	s.addChild(leftBorder);
};
Main.prototype.addRoad = function(){
	var s = this;

	/**创建路面*/
	var roadObj = new Road(0,450);
	s.addChild(roadObj);
};
Main.prototype.addBicycle = function(){
	var s = this;
	
	//创建自行车对象
	s.bicycleObj = new Bicycle(50,385);//585
	s.addChild(s.bicycleObj);
};
Main.prototype.addRiver = function(){
	var s = this;

	//设置河流深度
	var riverDepth = 300;
	//河流显示坐标
	var posY = s.sceneHeight-riverDepth;

	//浮力效果初始化
    var buoyancyController = new LStage.box2d.b2BuoyancyController();
    buoyancyController.normal.Set(0,-1);
    buoyancyController.offset = -posY/LStage.box2d.drawScale;
    buoyancyController.density = 40;
    buoyancyController.linearDrag = 10;
    buoyancyController.angularDrag = 30;
    buoyancyController.velocity = 2;
    LStage.box2d.world.AddController(buoyancyController);
	//显示水面
	var riverObj = new LSprite();
	riverObj.y = posY
	riverObj.graphics.drawRect(1,"#ffffff",[0,0,s.sceneWidth,riverDepth],true,"#000000");
	riverObj.alpha = 0.2;
	s.addChild(riverObj);

	//将自行车悬浮在水面
	for(var key in s.bicycleObj.bodyList){
		var obj = s.bicycleObj.bodyList[key].box2dBody;
		if(obj)buoyancyController.AddBody(obj);
	}
	var box = new LSprite();
	box.x = 350;
	box.y = 585;
	s.addChild(box);
	box.addBodyPolygon(100,100,1,1,.4,.2);
	buoyancyController.AddBody(box.box2dBody);
};
Main.prototype.postSolve = function(contact){
	var l = world.jointList;
	if(l.length == 0)return;
	//获取碰撞的LSprite对象
	var cA = contact.GetFixtureA().GetBody().GetUserData();
	var cB = contact.GetFixtureB().GetBody().GetUserData();
	//判断是否摧毁自行车
	if(
		//--------------------------------------------
		//条件一：当自行车和墙碰撞时
		//--------------------------------------------
		(
			(cA.name=="wall" && cB.name=="bicycle")
			||
			(cA.name=="bicycle" && cB.name=="wall")
		)
		||
		//--------------------------------------------
		//条件二：当自行车的车把、车把到轮子的支架或者车座碰到其他物体时
		//--------------------------------------------
		(
			(cA.trigger=="destroy_bicycle" && cB.name!="bicycle")
			||
			(cA.name!="bicycle" && cB.trigger=="destroy_bicycle")
		)
	){
		//去掉自行车上的所有关节以达到催毁自行车
		for(var i in l){
			var jo = l[i];
			//去掉关节
			LStage.box2d.world.DestroyJoint(jo);
			//从自行车关节列表中移除该关节
			l.splice(i,1);
			//将游戏结束控制器设置为游戏结束
			world.gameOverController = true;
			//添加游戏结束提示
			var gameOverText = new LTextField();
			gameOverText.text = "Game Over";
			gameOverText.size = 50;
			gameOverText.alpha = 0;
			gameOverText.x = (LStage.width-gameOverText.getWidth())*0.5;
			gameOverText.y = (LStage.height-gameOverText.getHeight())*0.5;
			addChild(gameOverText);
			LTweenLite.to(gameOverText,3,{
				delay:2,
				alpha:1
			});
		}
	}
};
Main.prototype.loop = function(event){
	var s = event.target;
	var bo = s.bicycleObj.mainBody.GetUserData();
	/**设置场景位置*/
	s.x = LStage.width*0.5 - (bo.x + bo.getWidth()*0.5);
	s.y = LStage.height*0.5 - (bo.y + bo.getHeight()*0.5);
	/**处理位置*/
	if(s.x > 0){
		s.x = 0;
	}else if(s.x < LStage.width - s.sceneWidth){
		s.x = LStage.width - s.sceneWidth;
	}
	if(s.y > 0){
		s.y = 0;
	}else if(s.y < LStage.height - s.sceneHeight){
		s.y = LStage.height - s.sceneHeight;
	}
	//计算刚体坐标
	LStage.box2d.synchronous();
};