
$(function() {

  const teamColors = {
    0: ['#808C95', 'silver'],
    1: ['#F6C900', 'yellow'],
    2: ['#D61B29', 'red'],
    3: ['#1F5CD4', 'blue'],
    4: ['#F8660A', 'orange'],
    5: ['#2BB20A', 'green'],
    6: ['#FC40BE', 'pink'],
    7: ['#9100FF', 'purple'],
  }
  const kresgeOrder = [6, 7, 2, 4, 1, 5, 3, 0]
  const TRAPEZOID_BOTTOM = 40;
  const DOTS_RADIUS = 10;
  const DOT_SPACING = 30;
  const SIGNUP_BOX_FULL_WIDTH = 240;

  var engine;
  var enterEmail = false;
  var activeGoBtn = false;
  var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

  // Event Handlers
  $(document).on('mouseover', '.content-inner', function() {
    //
  })

  $(document).on('click', '.signup-box', function() {
    if (engine.world.gravity.x == 0) activateDots();
    transformEmailTextbox();
  })

  $(document).on('click', '.go-btn', function() {
    submitEmail();
  })

  $(document).on('keyup', '.enter-email', function(e) {
    activateTextInput(e);
  })

  function activateTextInput(e) {
    if (e.which == 13) {
      submitEmail();
    }

    $('.go-btn').animate({
      color: '#ffffff',
      backgroundColor: 'green'
    })

    activeGoBtn = true;
    randomShade = Math.random()*0.7 + 0.3
    randomColor = 'rgba(255,255,255,'+randomShade+')';
    ball = Bodies.circle(initWinWidth/2, topOfBalls, DOTS_RADIUS,
    {
      friction: 0,
      restitution: 1.1,
      render: {
        fillStyle: randomColor, // colouredBalls[i],
        strokeStyle: randomColor// colouredBalls[i]
      }
    })

    World.add(engine.world, ball);

    Matter.Body.applyForce(ball, {
        x : 0,
        y : 0
      }, {
        x : (Math.random()-0.5)/200,
        y : 0
    })
  }

  function transformEmailTextbox() {
    if (!enterEmail) {
      enterEmail = true;
      jQuery.fx.interval = 10;
      $('.signup-text').animate({
        opacity: 0,
      }, 100, function() {
        $('.go-btn').css('opacity', 1);
        $('.signup-box').animate({
          backgroundColor: '#fff',
        }, 50, function() {
          // This is a shame - safari can't render gooey properly. 
          // I'm so sorry safari. I'm so, so sorry.
          if (!isSafari) {
            $('.signup').css({
              'filter': 'url(\'#goo\')',
              '-webkit-filter': 'url(\'#goo\')'  
            })
          }
          $('.go-btn').animate({
            right: 10
          }, 200, 'easeInOutQuad')
          $('.signup-box').animate({
            width: SIGNUP_BOX_FULL_WIDTH,
            left: -24,
          }, 200, 'easeInOutQuad', function() {
            $('.signup').css({
              'filter': 'none',
              '-webkit-filter': 'none'
            })
            $('.enter-email').show();
            $('.enter-email').focus();
          })
        })
      });
    }
  }

  function submitEmail() {
    if ($('.go-btn').css('display') != 'none') {
      $('.confirm-message').hide();
      $('.go-btn').css('display', 'none')
      $('.signup-box').animate({
        width: 0,
        opacity: 0,
        left: 0
      }, 200, function() {
        $(this).slideUp(200, function() {
          $('.confirm-message').html('&nbsp;');
          $.post('process.php', {email: $('.enter-email').val()}, function(data) {
            data = $.parseJSON(data);
            console.log(data);
            $('.confirm-message').html(data.message);
            $('.confirm-message').fadeIn();

            if (data.status == 'error') {
              $('.confirm-message').css('color', '#e12548');
              $('.go-btn').css('display', 'block');
              $('.signup-box').animate({
                marginBottom: 10,
                width: SIGNUP_BOX_FULL_WIDTH,
                left: -24,
                opacity: 1
              }).slideDown();
            } else {
              $('.confirm-message').css('color', '#fff');
            }
          })
        });
      })
    }
  }

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
      ww + ',200 ' + 
      '0,200';
    $('.slanted-background-bottom').find('polygon').attr('points', points)
  }

  function init() {
    drawTopTrapezoid();
    drawBottomTrapezoid();
    addKresgeBars();
  }

  function activateDots() {
    for (i in ballBodies) {
    Matter.Body.applyForce(ballBodies[i], {
        x : 0,
        y : 0
      }, {
        x : (Math.random()-0.5)/300,
        y : -Math.random()/150 - 0.005
      })
    }
    engine.world.gravity.y = 1.5
    engine.world.gravity.x = 0.1
  }

  function growKresgeBar(id) {
    $('#bar-' + i).animate({
      top: 0,
      height: 60
    }, 300)
  }

  function addKresgeBars() {
    for (i in teamColors) {
      var bar = $('<div></div>');
      bar.addClass('color-bar')
        .attr('id', 'bar-' + i)
        .css({
          'backgroundColor': teamColors[i][0],
          'left': kresgeOrder.indexOf(parseInt(i))*10 + 30
        })
      $('.bars-kresge').append(bar);
    }
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
  topOfBalls = topOfContent - 60;
  ballBodies = [];
  allBodies = [];

  for (i = 0; i < 8; i ++) {
    ball = Bodies.circle(i*DOT_SPACING + initWinWidth/2 - DOT_SPACING*4 + DOT_SPACING/2, topOfBalls, DOTS_RADIUS,
    {
      friction: 0,
      restitution: 1.1,
      render: {
        fillStyle: teamColors[i][0],
        strokeStyle: teamColors[i][0]
      }
    })

    ballBodies.push(ball)
  }

  groundAngle = Math.tan(TRAPEZOID_BOTTOM/initWinWidth);
  midGroundHeight = initWinHeight - 105 + 9;
  midGroundLocation = initWinWidth/2;
  var ground = Bodies.rectangle(midGroundLocation, midGroundHeight, initWinWidth+200, 20, { 
    restitution: 1.6, 
    friction: 0, 
    isStatic: true, 
    angle: groundAngle, 
    render: {
      visible: false
    }
  });

  allBodies = ballBodies.concat([ground])

  World.add(engine.world, allBodies);
  Engine.run(engine);
  engine.world.gravity.y = 0
  engine.world.gravity.x = 0
  engine.world.bounds.min.x = -1000;
  engine.world.bounds.min.y = -1000;
  engine.world.bounds.max.x = 5000;
  engine.world.bounds.max.y = 5000;

  init();

  setInterval(function() {
    for (i in ballBodies) {
      if (ballBodies[i] != '') {
        if (ballBodies[i].position.y > (initWinHeight-100) || ballBodies[i].position.x > initWinWidth) {
          growKresgeBar(i)
          ballBodies[(ballBodies[i].id-1)] = ''
        }
      }
    }
  }, 200)
})
