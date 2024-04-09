/**
 *SmoothGround.js

 * @param sx 平地起始x坐标
 * @param sy 平地起始y坐标
 * @param w 平地宽度
 * @param h 平地高度
*/
function SmoothGround(sx,sy,w,h){
	var s = this;
	base(s,LSprite,[]);

	//保存路面尺寸
	s.groundW = w;
	s.groundH = h;
	//设置位置
	s.x = sx+w/2;
	s.y = sy;
	//初始化
	s.init();
}
SmoothGround.prototype.init = function(){
	var s = this;
	//加入刚体
	s.addBodyPolygon(s.groundW,s.groundH,0);
};
SmoothGround.prototype.getGroundWidth = function(){
	return this.groundW;
};
SmoothGround.prototype.getGroundHeight = function(){
	return this.groundH;
};