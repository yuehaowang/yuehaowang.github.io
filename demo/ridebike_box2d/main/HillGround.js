/**
 *HillGround.js

 * @param x 山坡起始x坐标
 * @param y 山坡起始y坐标
 * @param a 山坡数量
 * @param hw 山坡宽度
 * @param hh 山坡高度
 * @param gw 平地部分宽度（实际平地部分宽度的两倍）
 * @param gh 平地部分高度
*/
function HillGround(x,y,a,hw,hh,gw,gh){
	var s = this;
	base(s,LSprite,[]);

	//保存山坡尺寸
	s.hillW = hw;
	s.hillH = hh;
	//保存山坡平地部分尺寸
	s.groundW = gw;
	s.groundH = gh;
	//保存山坡数量
	s.hillAmount = a;
	//设置初始位置
	s.sx = x;
	s.sy = y;
	//初始化
	s.init();
}
HillGround.prototype.init = function(){
	var s = this;

	//加入山坡下方的平地
	var ground = new LSprite();
	ground.x = s.sx+s.getGroundWidth()/2;
	ground.y = s.sy;
	ground.addBodyPolygon(s.getGroundWidth(),s.groundH,0);
	world.addChild(ground);

	//设置山坡顶点初始位置
	var toX = 0;
	var toY = 0;
	//循环添加山坡
	for(var i=0; i<s.hillAmount; i++){
		//设置山坡顶点数组
		var shapeArray = new Array();
		shapeArray.push(new Array());
		shapeArray[0].push([toX,toY]);
		shapeArray[0].push(
			[toX+=s.hillW,toY-=s.hillH],
			[toX+=s.hillW,toY+=s.hillH]
		);
		var hill = new LSprite();
		hill.x = s.sx+s.groundW;
		hill.y = s.sy-s.hillH/2-s.groundH/2;
		//绘画多边形刚体
		hill.addBodyVertices(shapeArray,0,s.hillH/2,0);
		//加入显示列表
		world.addChild(hill);
	}
};
HillGround.prototype.getGroundWidth = function(){
	return this.groundW*2+this.hillAmount*2*this.hillW;
};
HillGround.prototype.getGroundHeight = function(){
	return this.groundH+this.hillH;
};