$(function() {
  var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

  // create a Matter.js engine
  var engine = Engine.create(document.body, { 
    render: {
        options: {
            wireframes: false
        }
    }
});

  // create two boxes and a ground
  var boxA = Bodies.circle(400, 200, 20, { restitution: 0.9} );
  var boxB = Bodies.circle(450, 50, 20, { restitution: 0.9,    
    render: {
         fillStyle: 'red',
         lineStyle: 'none'
    }
  });

  var ground = Bodies.rectangle(400, 610, 810, 60, { restitution: 0.9, isStatic: true, angle: Math.PI * 0.04  });

  // add all of the bodies to the world
  World.add(engine.world, [boxA, boxB, ground]);

  // run the engine
  Engine.run(engine);

})

if (window.DeviceOrientationEvent) {
  console.log('tilty')
  // Listen for the deviceorientation event and handle the raw data
  window.addEventListener('deviceorientation', function(eventData) {
    // gamma is the left-to-right tilt in degrees, where right is positive
    var tiltLR = eventData.gamma;

    // beta is the front-to-back tilt in degrees, where front is positive
    var tiltFB = eventData.beta;

    // alpha is the compass direction the device is facing in degrees
    var dir = eventData.alpha

    // call our orientation event handler
    console.log(tiltLR, tiltFB, dir);
    // deviceOrientationHandler(tiltLR, tiltFB, dir);
  }, false);

} else {
  console.log('no-tilty')
}