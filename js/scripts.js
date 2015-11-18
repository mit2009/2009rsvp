function drawTopTrapezoid() {
  ww = $(window).width();
  points = '0,0 ' + 
    ww + ',0 ' +
    ww + ',70 ' + 
    '0,110';
  $('.slanted-background-top').find('polygon').attr('points', points)
}

function drawBottomTrapezoid() {
  ww = $(window).width();
  points = '0,0 ' + 
    ww + ',50 ' +
    ww + ',110 ' + 
    '0,110';
  $('.slanted-background-bottom').find('polygon').attr('points', points)
}

function init() {
  drawTopTrapezoid();
  drawBottomTrapezoid();
}

$(function() {

  $(window).resize(function() {
    drawTopTrapezoid();
    drawBottomTrapezoid();
  });

  init()

  var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

  var engine = Engine.create(document.body, { 
    render: {
      fillStyle: 'none',
      options: {
        wireframes: false
      }
    }
  });

  colouredBalls = ['red', 'blue', 'gray', 'yellow', 'orange', 'green', 'purple', 'pink']
  ballBodies = []
  for (i = 0; i < 8; i ++) {
    ball = Bodies.circle(i*30 + 50, 100, 10,
    {
      friction: 0,
      restitution: 1.1,
      render: {
        fillStyle: colouredBalls[i],
        strokeStyle: colouredBalls[i]
      }
    })
    Matter.Body.applyForce(ball, {
      x : 0,
      y : 0
    }, {
      x : (Math.random()-0.5)/400,
      y : -Math.random()/300
    })
    ballBodies.push(ball)
  }

  var ground = Bodies.rectangle(400, 610, 810, 60, { 
    restitution: 1.6, 
    friction: 0, 
    isStatic: true, 
    angle: Math.PI * 0.04  
  });

  ballBodies.push(ground)
  World.add(engine.world, ballBodies);
  Engine.run(engine);
  engine.world.gravity.y = 1
})

if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', function(eventData) {
    var tiltLR = eventData.gamma;
    var tiltFB = eventData.beta;
    var dir = eventData.alpha
    console.log(tiltLR, tiltFB, dir);
  }, false);

} else {
  console.log('no-tilty')
}