$(function() {
  var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

  // create a Matter.js engine
  var engine = Engine.create(document.body);

  // create two boxes and a ground
  var boxA = Bodies.circle(400, 200, 80, { restitution: 0.9} );
  var boxB = Bodies.circle(450, 50, 20, { restitution: 0.9} );
  var ground = Bodies.rectangle(400, 610, 810, 60, { restitution: 0.9, isStatic: true, angle: Math.PI * 0.04  });

  // add all of the bodies to the world
  World.add(engine.world, [boxA, boxB, ground]);

  // run the engine
  Engine.run(engine);
})