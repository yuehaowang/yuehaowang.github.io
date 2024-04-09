/**
 *DownhillGround.js

 * @param sx 斜坡起始x坐标
 * @param sy 斜坡起始y坐标
 * @param w 斜坡宽度
 * @param h 斜坡高度
 * @param angle 斜坡坡度
*/
function SlopeGround(sx,sy,w,h,angle){
	var s = this;
	base(s,LSprite,[]);

	//保存路面尺寸
	s.groundW = w;
	s.groundH = h;
	//保存坡度
	s.angle = angle;
	//设置位置
	s.x = sx+s.getGroundWidth()/2-(Math.sin(s.angle*Math.PI/180)*s.groundH*0.5);
	s.y = sy+s.getGroundHeight()/2;
	//初始化
	s.init();
}
SlopeGround.prototype.init = function(){
	var s = this;
	//加入刚体
	s.addBodyPolygon(s.groundW,s.groundH,0);
	//旋转刚体
	s.setRotate(s.angle*(Math.PI/180));
};
SlopeGround.prototype.getGroundWidth = function(){
	return (Math.cos(this.angle*Math.PI/180)*this.groundW);
};
SlopeGround.prototype.getGroundHeight = function(){
	return (Math.sin(this.angle*Math.PI/180)*this.groundW);
};