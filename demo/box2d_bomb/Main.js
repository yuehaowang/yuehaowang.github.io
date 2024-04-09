window.addEventListener("load", main, false);

var b2Vec2 = Box2D.Common.Math.b2Vec2
, b2AABB = Box2D.Collision.b2AABB
, b2BodyDef = Box2D.Dynamics.b2BodyDef
, b2Body = Box2D.Dynamics.b2Body
, b2FixtureDef = Box2D.Dynamics.b2FixtureDef
, b2Fixture = Box2D.Dynamics.b2Fixture
, b2World = Box2D.Dynamics.b2World
, b2MassData = Box2D.Collision.Shapes.b2MassData
, b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
, b2DebugDraw = Box2D.Dynamics.b2DebugDraw
, b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
, b2RayCastInput = Box2D.Collision.b2RayCastInput
, b2RayCastOutput = Box2D.Collision.b2RayCastOutput;

var world, fixDef, bodyDef;

var bomb = null;

var timer = 0;

function main () {
	world = new b2World(new b2Vec2(0, 9.8), true);

	fixDef = new b2FixtureDef();
	fixDef.density = 1.0;
	fixDef.friction = 0.5;
	fixDef.restitution = 0.2;

	bodyDef = new b2BodyDef();

	createGround();
	createBlocks();
	createBomb();
	createDebugDraw();
	setInterval(update, 1000 / 60);
}

function createGround () {
	fixDef.shape = new b2PolygonShape();
	fixDef.shape.SetAsBox(20, 1);
	
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.position.Set(10, 13);

	world.CreateBody(bodyDef).CreateFixture(fixDef);
}

function createBlocks () {
	var list = [
		{width : 120, height : 30, x : 140, y : 330},
		{width : 20, height : 100, x : 50, y : 200},
		{width : 20, height : 100, x : 230, y : 200},
		{width : 120, height : 20, x : 140, y : 80},
		{width : 120, height : 30, x : 440, y : 330},
		{width : 20, height : 100, x : 350, y : 200},
		{width : 20, height : 100, x : 530, y : 200},
		{width : 120, height : 20, x : 440, y : 80}
	];

	for (var i = 0; i < list.length; i++) {
		var data = list[i];

		fixDef.shape = new b2PolygonShape();
		fixDef.shape.SetAsBox(data.width / 30, data.height / 30);
		
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.Set(data.x / 30, data.y / 30);

		world.CreateBody(bodyDef).CreateFixture(fixDef);
	}
}

function createBomb () {
	fixDef.shape = new b2CircleShape(0.5);

	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.Set(9.7, 1);

	bomb = world.CreateBody(bodyDef);
	bomb.userData = "iambomb";
	bomb.CreateFixture(fixDef);
}

function createDebugDraw () {
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(document.getElementById("mycanvas").getContext("2d"));
	debugDraw.SetDrawScale(30.0);
	debugDraw.SetFillAlpha(0.5);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_controllerBit | b2DebugDraw.e_pairBit);
	world.SetDebugDraw(debugDraw);
}

function update () {
	world.Step(1 / 60, 10, 10);
	world.DrawDebugData();
	world.ClearForces();

	if (timer++ == 100) {
		detonated();
	}
}

function detonated () {
	var position = bomb.GetWorldCenter();

	var range = 3;

	for (var i = 0; i <= 100; i++) {
		var angle = 360 / 100 * i;

		var input = new b2RayCastInput();
		input.p1 = position;
		input.p2.Set(position.x + range * Math.cos(angle), position.y + range * Math.sin(angle));
		input.maxFraction = 1;

		var output = new b2RayCastOutput();

		for (var currentBody = world.GetBodyList(); currentBody; currentBody = currentBody.GetNext()) {
			if (currentBody.userData == bomb.userData) {
				continue;
			}

			var fix = currentBody.GetFixtureList();

			if (!fix) {
				continue;
			}
			
			var isHit = fix.RayCast(output, input);

			if (isHit) {
				var p1 = input.p1.Copy();
				var p2 = input.p2.Copy();
				p2.Subtract(p1);
				p2.Multiply(output.fraction);
				
				p1.Add(p2);

				var hitPoint = p1.Copy();
				
				hitPoint.Subtract(position);

				currentBody.ApplyForce(new b2Vec2(hitPoint.x * (1 - output.fraction) * 300, hitPoint.y * (1 - output.fraction) * 300), hitPoint);
			}

		}
	}

	world.DestroyBody(bomb);
}