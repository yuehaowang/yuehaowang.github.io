/**
 *Road.js

 * @param sx 路面桥起始x坐标
 * @param sy 路面起始y坐标
*/
function Road(sx,sy){
	var s = this;
	base(s,LSprite,[]);

	//设置起始位置
	s.sx = sx;
	s.sy = sy;

	//设置新对象出现位置
	s.newObjPosX = s.sx;
	s.newObjPosY = s.sy;

	/**设置路面数据*/
	s.roadData = level01

	//初始化
	s.init();
}
Road.TYPE = {
	//锁链桥
	Bridge:"bridge",
	//地面
	Ground:"ground",
	//空隙
	Spacing:"spacing"
};
Road.TERRAIN = {
	//平地
	Smooth:"smooth",
	//斜坡
	Slope:"slope",
	//山坡
	Hill:"hill"
};
Road.prototype.init = function(){
	var s = this;
	for(var key in s.roadData){
		var item = s.roadData[key];
		switch(item.type){
			/**路地*/
			case Road.TYPE.Ground:
				s.addGround(item);
				break;
			/**锁桥*/
			case Road.TYPE.Bridge:
				s.addBridge(item);
				break;
			/**空隙*/
			case Road.TYPE.Spacing:
				s.addSpacing(item);
				break;
		}
	}
};
Road.prototype.addSpacing = function(data){
	var s = this;
	//设置新对象出现位置
	s.newObjPosX += data.spacingWidth;
	s.newObjPosY += data.spacingHeight;
}
Road.prototype.addBridge = function(data){
	var s = this;
	
	//加入锁链桥
	var bridgeGroundObj = new BridgeGround(
		s.newObjPosX,
		s.newObjPosY,
		data.plankAmount,
		data.plankWidth,
		data.plankHeight
	);
	world.addChild(bridgeGroundObj);
	//设置新对象出现位置
	s.newObjPosX += bridgeGroundObj.getGroundWidth();
};
Road.prototype.addGround = function(data){
	var s = this;
	
	switch(data.terrain){
		case Road.TERRAIN.Smooth:
			//加入平地路面
			var smoothGroundObj = new SmoothGround(
				s.newObjPosX,
				s.newObjPosY,
				data.groundWidth,
				data.groundHeight
			);
			world.addChild(smoothGroundObj);
			//设置新对象出现位置
			s.newObjPosX += smoothGroundObj.getGroundWidth();
			break;
		case Road.TERRAIN.Hill:
			//加入斜坡路面
			var hillGroundObj = new HillGround(
				s.newObjPosX,
				s.newObjPosY,
				data.slopeAmount,
				data.hillWidth,
				data.hillHeight,
				data.groundWidth,
				data.groundHeight
			);
			world.addChild(hillGroundObj);
			//设置新对象出现位置
			s.newObjPosX += hillGroundObj.getGroundWidth();
			break;
		case Road.TERRAIN.Slope:
			//加入山坡路面
			var slopeGroundObj = new SlopeGround(
				s.newObjPosX,
				s.newObjPosY,
				data.groundWidth,
				data.groundHeight,
				data.angle
			);
			world.addChild(slopeGroundObj);
			//设置新对象出现位置
			s.newObjPosX += slopeGroundObj.getGroundWidth();
			s.newObjPosY += slopeGroundObj.getGroundHeight();
			break;
	}
};