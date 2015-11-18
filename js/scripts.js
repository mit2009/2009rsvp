
$(function() {

  $(document).on('mouseover', '.content-inner', function() {
    if (engine.world.gravity.x == 0) {
      activateDots();
    }
  })

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
      ww + ',' + TRAPEZOID_BOTTOM + ' ' +
      ww + ',110 ' + 
      '0,110';
    $('.slanted-background-bottom').find('polygon').attr('points', points)
  }

  function init() {
    drawTopTrapezoid();
    drawBottomTrapezoid();
  }

  var engine;

  const TRAPEZOID_BOTTOM = 50;
  const DOTS_RADIUS = 10;
  const DOT_SPACING = 30;

  function activateDots() {
    for (i in ballBodies) {
    Matter.Body.applyForce(ballBodies[i], {
        x : 0,
        y : 0
      }, {
        x : (Math.random()-0.5)/300,
        y : -Math.random()/150
      })
    }
    engine.world.gravity.y = 1.5
    engine.world.gravity.x = 0.1
  }

  initWinWidth = $(window).width();
  initWinHeight = $(window).height();

  $(window).resize(function() {
    drawTopTrapezoid();
    drawBottomTrapezoid();
  });

  var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

  var canvas = document.getElementById('test');
  $('#test').attr('width',initWinWidth);
  $('#test').attr('height',initWinHeight);

  engine = Engine.create(document.body, { 
    render: {
      canvas: canvas,
      options: {
        // width: $(window).width(),
        // height: $(window).height(),
        background: 'none',
        wireframes: false,
        enableSleeping: false,
        hasBounds: false,
      }
    }
  });

  topOfContent = $('.content').offset().top;
  topOfBalls = topOfContent - 50;
  colouredBalls = ['red', 'blue', 'gray', 'yellow', 'orange', 'green', 'purple', 'pink']
  ballBodies = []
  for (i = 0; i < 8; i ++) {
    ball = Bodies.circle(i*DOT_SPACING + initWinWidth/2 - DOT_SPACING*4 + DOT_SPACING/2, topOfBalls, DOTS_RADIUS,
    {
      friction: 0,
      restitution: 1.1,
      render: {
        fillStyle: colouredBalls[i],
        strokeStyle: colouredBalls[i]
      }
    })


    ballBodies.push(ball)
  }

  groundAngle = Math.tan(TRAPEZOID_BOTTOM/initWinWidth);
  midGroundHeight = initWinHeight - 85 + 9;
  midGroundLocation = initWinWidth/2;
  var ground = Bodies.rectangle(midGroundLocation, midGroundHeight, 2000, 20, { 
    restitution: 1.6, 
    friction: 0, 
    isStatic: true, 
    angle: groundAngle, 
    render: {
      visible: false
    }
  });

  ballBodies.push(ground)
  World.add(engine.world, ballBodies);
  Engine.run(engine);
  engine.world.gravity.y = 0
  engine.world.gravity.x = 0
  engine.world.bounds.min.x = -Infinity;
  engine.world.bounds.min.y = -Infinity;
  engine.world.bounds.max.x = Infinity;
  engine.world.bounds.max.y = Infinity;

  init();
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