/**
 *BridgeGround.js

 * @param x 锁链桥起始x坐标
 * @param y 锁链桥起始y坐标
 * @param a 锁链桥木板数量
 * @param w 锁链桥木板宽度
 * @param h 锁链桥木板高度
*/
function BridgeGround(sx,sy,a,w,h){
	var s = this;
	base(s,LSprite,[]);

	/**保存初始位置*/
	s.sx = sx;
	s.sy = sy;
	/**添加对象数量*/
	s.amount = a;
	/**设置对象宽度和高度*/
	s.bw = w;
	s.bh = h;
	/**获取锁链桥总长度*/
	s.bridgeWidth = s.bw*s.amount;
	/**设置固定锁桥的节点*/
	//节点尺寸
	var anchorW = anchorH = 5;
	//节点A
	s.anchorA = new LSprite();
	s.anchorA.x = s.sx;
	s.anchorA.y = s.sy-s.bh/2;
	s.anchorA.addBodyPolygon(anchorW,anchorH,0);
	world.addChild(s.anchorA);
	//节点B
	s.anchorB = new LSprite();
	s.anchorB.x = s.sx+s.bridgeWidth;
	s.anchorB.y = s.sy-s.bh/2;
	s.anchorB.addBodyPolygon(anchorW,anchorH,0);
	world.addChild(s.anchorB);

	//初始化
	s.init();
}
BridgeGround.prototype.init = function(){
	var s = this;

	//添加对象数量
	var amount = s.amount;
	//设置对象宽度和高度
	var bw = s.bw;
	var bh = s.bh;
	//获取锁链桥总长度
	var bridgeWidth = s.bridgeWidth;
	//设置锁链桥开始位置
	var initX = s.sx;
	var initY = s.sy-bh/2;

	/**用于固定锁链桥的定点A*/
	var anchorA = s.anchorA;
	/**用于固定锁链桥的定点B*/
	var anchorB = s.anchorB;

	//关节向量
	var vec = new LStage.box2d.b2Vec2();
	//上一个对象
	var previousBlock = anchorA;

	/**循环添加刚体*/
	for(var i=0; i<amount; i++){
		//实例化对象
		var block = new LSprite();
		//设定对象位置
		block.x = initX+i*bw+bw*0.5;
		block.y = initY;
		//加入刚体
		block.addBodyPolygon(bw,bh,1);
		//加入显示列表
		world.addChild(block);
		//加入关节
		var revoluteJoint = new LStage.box2d.b2RevoluteJointDef();
		vec.Set((initX+i*bw)/LStage.box2d.drawScale, initY/LStage.box2d.drawScale);
		revoluteJoint.Initialize(previousBlock.box2dBody,block.box2dBody,vec);
		LStage.box2d.world.CreateJoint(revoluteJoint);
		//更改上一个对象
		previousBlock = block;
	}
	//将最后一个刚体固定
	var revoluteJoint = new LStage.box2d.b2RevoluteJointDef();
	vec.Set((initX+i*bw)/LStage.box2d.drawScale, initY/LStage.box2d.drawScale);
	revoluteJoint.Initialize(previousBlock.box2dBody,anchorB.box2dBody,vec);
	LStage.box2d.world.CreateJoint(revoluteJoint);
};
BridgeGround.prototype.getGroundWidth = function(){
	return this.bridgeWidth;
};
BridgeGround.prototype.getGroundHeight = function(){
	return this.bh;
};