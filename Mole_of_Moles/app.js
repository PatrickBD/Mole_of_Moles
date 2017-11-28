
$('#JavascriptBlock').hide();
$("#PageText").hide();
$('#GameHide').css("visibility", "visible")
$('#DebugOptions').hide();


$(document).ready(function(){
//Canvas stuff
  var log = [""]
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var cw = 10;
  var xmax = (w/cw)-1
  var ymax = (h/cw)-1
	var d;
  var div;
  var s;
  var musicmute = false;
  var soundmute = false;
  var musicon = false;
  var pauseon = false;
  var audio = document.getElementById('MusicPlayer');
// game stuff
	var restoresave = false;
  var level = 1;
  var leveling;
  var levelarray;
  var threshold;
  var megamoletiplier;
  var megamolerate;
  var flash = false;
  var game_loop
  var gamelength = "Average"
  var gameon = false;
  var shake = [0,true,0,1];
  var molerate;
  var clickrate;
  var totalmoles;
  var animateturns;
  var playtime;
  var speed;
  var upgradecostmult = 1.15;
  var up  = {};
  var moleicons;
  var sprinklericons;
  var moleclickicons = [];
  var lightmax;
  var molewavewidth = 10;
  var molewaveheight = 250;
  var sprinklerrate = 0;
  var sprinkly = 20;
  var levelscreen = false;
  var thresholdreached = false;
  var curlight = 0;
  var scientificnotation = true;
  var iconrotate = 0;
  var currentammount = 0;
  var amountarray = [
    {amount: 1, multi: 1},
    {amount: 10, multi: 20.4},
    {amount: 100, multi: 78287497}
  ]
// images
  var moleimg = new Image();
  var titlepageimg = new Image();
  var molewaveimg = new Image();
  var molewavealtimg = new Image();
  var arrowimg = new Image();
	var lightimg = new Image();
  var intropageimg = new Image();
  var crustimg = new Image();
  crustimg.src = "images/space_crust.png"
  arrowimg.src = "images/Next_Arrow.png"
  lightimg.src = "images/lights/Black_Light.png"
  titlepageimg.src = "images/titlepage.png"
  moleimg.src = "images/Mole_Color.png";
  molewaveimg.src = "images/Color_Wave.png";
  var molecolorimg = new Image();
  molecolorimg.src = "images/Mole_Color.png"
  var levelbackimg = new Image();
  levelbackimg.src = "images/lab.png"
// sounds
  function clicksound() {
    var snd = new Audio();
    snd.src = "squeek.mp3";
    snd.volume = 0.3;
    snd.play();
  };
  function upgradesound() {
    var snd = new Audio();
    snd.src = "upgrade_click.wav";
    snd.volume = 0.3;
    snd.play();
  };
  var levelupsound = new Audio();
  levelupsound.src = "level_up_sound.wav";
  levelupsound.volume = 0.3;
  var levelscreensound = new Audio();
  levelscreensound.src = "levelscreen.wav";
  levelscreensound.volume = 0.7;
  musicpicker();
// Restore save button
	var cookiecheck = getCookie('level')
	if (cookiecheck > 0) {
		$('#Log').html("<button id='ContinueButton'>Continue your last game? Click me!</button>")
	}
//titlepage
  var titlerotate = [0,true]
  function shaker(current,positive,n = 2, rate = 1) {
    if (current > n) {
      positive = false;
    } else if (current < (0-n)) {
      positive = true;
    }
    if (positive) {
      current+=rate;
    } else {
      current-=rate;
    }
    return [current, positive, n , rate]
  }
  function rotation(rw,rh,rotate = titlerotate[0]) {
    ctx.save();
    ctx.translate( rw, rh );
    ctx.rotate(rotate*Math.PI/180);
    ctx.translate( -rw, -rh );
  }
  var pageflash = false
  var titleturns = 0;
  function titlepage() {
    titlerotate = shaker(titlerotate[0],titlerotate[1],5)
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    rotation(w/2,h/2)
    ctx.drawImage(moleimg, (w/2)-60,(h/2)-60,120,120);
    ctx.restore();
    ctx.font = "45px Comic Sans MS";
    ctx.textAlign = "center"
    ctx.fillStyle = "black"
    ctx.fillText("A MOLE OF MOLES", w/2 ,75);
    ctx.font = "12px Comic Sans MS";
    ctx.fillText("A xkcd game jam entry by Patrick DeKelly", w/2 ,100);
    ctx.font = "25px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.fillText("CLICK TO START", w/2 ,150);
    sprinkler();
    moleiconmovement();
    molewaveheight = 100;
    molewave(titleturns)
    titleturns++;
    if (titleturns > 1) {
      titleturns = 0;
    }
    pageflash = !pageflash
  }
  title_loop = setInterval(titlepage, 100);
// sprinkler and click animation
  function sprinkler(){
    sprinklerrate++;
    if (sprinklerrate >= sprinkly) {
      sprinklerrate = 0;
      spread = Math.floor(Math.random() * 20)-10
      moleclickicons.push({x: 250, y: 125,t: 0,spread: spread})
    }
  }
	// too late, hacky, get it done!
  function moleiconmovement(){
    found = true;
    while (found) {
      found = false;
      for (var i = 0; i < moleclickicons.length; i++) {
        cur = moleclickicons[i]
        cur.t++
        if (cur.t > 30) {
          moleclickicons.splice(i,1)
          found = true;
          continue
        } else if (cur.t < 5) {
          cur.x += cur.spread;
          cur.y -= 10;
        } else {
          cur.x += cur.spread;
          cur.y += 20;
        }
      }
    }
    sizer = 10*(5-Math.ceil(level/2))
    drawarray(moleclickicons, moleimg, sizer, sizer);
  }
// click logger
  context = document.getElementById('canvas').getContext("2d");
  function getClickPosition(e) {
    if (true) {
      xp = (e.clientX-document.getElementById('canvas').offsetLeft) | 0;
      yp = (e.clientY-document.getElementById('canvas').offsetTop) | 0;
      target = {x:xp,y:yp};
      if (levelscreen) {
        levelscreen = false;
      } else if (gameon) {
        moleclick(w/2,h/4);
      }
      if (!gameon) {
        if (gamewin) {
          endpages();
        } else {
          clearInterval(title_loop);
          clearInterval(title_loop);
          intropages();
        }
      }
    }
  }
  document.getElementById('canvas').addEventListener("click", getClickPosition, false);
// log text stuff
  function logtext(text, alert = false) {
    log.push(text);
    log.shift()
    $('#Log').html(log);
  };
  var randomnews = [
    "6 times 10^23",
    "The mole the merrier",
    "A Mole-mole is a mole double agent",
    "Potatoes and mole-asses: not as tasty as the song claims",
    "Hole-y Mole-y!",
    "Big numbers mean this game is educational, right?",
  ]
  var rotatelog = 0;
// intro pages
  var intro1img = new Image();
  var intro2img = new Image();
  var intro3img = new Image();
  var intro4img = new Image();
  var intro5img = new Image();
  intro1img.src = "images/intro/intro1.png"
  intro2img.src = "images/intro/intro2.png"
  intro3img.src = "images/intro/intro3.png"
  intro4img.src = "images/intro/intro4.png"
  intro5img.src = "images/intro/intro5.png"
  var currentpage = 0
  function intropages(){
    introarray = [intro1img,intro2img,intro3img,intro4img,intro5img]
    if (currentpage >= 5) {
      instructionpageshow();
    } else {
      intropageimg = introarray[currentpage]
      currentpage++;
      context.drawImage(intropageimg, 0,0,w,h)
      context.drawImage(arrowimg, 400,450,100,50)
    }
  }
// end pages
  var end1img = new Image();
  var end2img = new Image();
  var end3img = new Image();
  var end4img = new Image();
  var endpageimg = new Image();
  end1img.src = "images/end/end1.png"
  end2img.src = "images/end/end2.png"
  end3img.src = "images/end/end3.png"
  end4img.src = "images/end/end4.png"
  var gamewin = false
  function endpages(){
    endarray = [end1img,end2img,end3img,end4img]
    if (currentpage >= 4) {
      finalpageshow()
      currentpage = 0;
    } else {
      endpageimg = endarray[currentpage]
      currentpage++;
      context.drawImage(endpageimg, 0,0,w,h)
      context.drawImage(arrowimg, 400,450,100,50)
    }
  }
// instruction page
  function instructionpageshow(){
    introtext = "Welcome to A Mole of Moles! This game was made in 72 hours for the xkcd Game Jam in November of 2017. For those who don’t know, the theme was to make a game based off of one of the xkcd webcomics or “What If?” articles. As you might imagine, I chose for my project the “What if?” article “A Mole of Moles”. It’s a short witty piece on what a mole(the unit of measurement) of moles(the small furry critter) might look like."
    introtext += "<br><br>(<img src='images/Mole_Color.png' style='width: 20px;height: 20px'></img>Check it out at: <a href='https://what-if.xkcd.com/4/'>https://what-if.xkcd.com/4/</a>)"
    introtext += "<br><br>A Mole of Moles is an idle/clicker style game with level mechanics. It can be played either actively or passively in the background (however, like any JS game, it will slow down if not an active tab). Buy upgrades and click on the Mole Hole to produce moles. Click on the Thresh-mole-d button when you have enough moles to level up and raise your Mega Mole-tiplier! Try to get to 6.02 x 10^23 moles! It’s exponential-tastic!"
    introtext += "<br><br>Game Lengths: Time to reach one mole. Estimates are based on simulations. Games may be longer with more passive play."
    introtext += "<br><br><button title = 'Estimated time: ~2-3 hours' class='DifficultyButtons' id='QuickButton'>Quick</button>"
    introtext += "<button title = 'Estimated time: ~4-6 hours' class='DifficultyButtons' id='AverageButton'>Average</button>"
    introtext += "<button title = 'Estimated time: ~days+' class='DifficultyButtons' id='LongButton'>Mole-athon</button>"
    introtext += "<br><br>(Game saves automatically with cookies after buying upgrades, please allow)"
    textpage(introtext)
  }
// final page
  function finalpageshow(){
		restoresave = false;
    text = "Thanks for playing! Feel free to provide feedback. Be sure to check out the other xkcd jam entries and read the article if you have not already."
    text += "<br><br>(<img src='images/Mole_Color.png' style='width: 20px;height: 20px'></img>Check it out at: <a href='https://what-if.xkcd.com/4/'>https://what-if.xkcd.com/4/</a>)"
    text += "<br><br>Play Again?"
    text += "<br><br>Game Lengths: Time to reach one mole. Games may be longer with more passive play."
    text += "<br><br><button title = 'Estimated time: ~2-3 hours' class='DifficultyButtons' id='QuickButton'>Quick</button>"
    text += "<button title = 'Estimated time: ~4-6 hours' class='DifficultyButtons' id='AverageButton'>Average</button>"
    text += "<button title = 'Estimated time: ~days+' class='DifficultyButtons' id='LongButton'>Mole-athon</button>"
    textpage(text)
  }
// help page
  function helpshow(){
    text = "Well, that makes Moley sad :("
    text += "<br><br><img src='images/Mole_Sad.png' style='width: 100px;height: 100px'></img>"
    text += "<br><br>This game was rushed in 72 hours so bugs are likely. Feel free to unlock the debug commands and mess around. Hopefully, you are not just a cheater. To each their own."
    text += "<br><br><button id='CheatButton'>Unlock Tools</button>"
    text += "<button id='NotCheatButton'>Return To game</button>"
    text += "<br><br>(This option will be removed post-comp)"
    textpage(text)
  }
// text page function
	function textpage(text) {
		$("#canvas").hide();
		$("#PageText").show();
		$("#PageText").html(text);
	}
//game start
	function init()
	{
    gameon = true;
    level = 1;
    s = 50;
    div = 0.1;
    threshold = 1000;
    lightmax = threshold/20.0
    megamoletiplier = 1;
    speed = 100;
    totalmoles = 0;
    molerate = 0;
    clickrate = 1;
    playtime = 0;
    animateturns = 0;
    playtime = 0;
    gameon = true;
    pauseon = false;
    molewavewidth = 0;
    molewaveheight = 350;
    molewaveimg.src = "images/B+W_Wave.png";
    moleicons = [];
    moleclickicons = [];
    sprinklericons = [];
    sprinkly = 30;
    sprinklericons.push({x: 240, y: h/4,t: 0})
    sprinklerrate = 0;
    gamewin = false;
    levelscreen = false;
    thresholdreached = false;
    levelbackimg.src = "images/lab.png";
    moleimg.src = "images/Mole_B+W.png";
    molewaveimg.src = "images/B+W_Wave.png";
    iconrotate = 1;
    $('#MultiInfo').html("x"+numbercleanup(megamoletiplier))
    clearInterval(title_loop)
    //upgrades
    function  upgradetype(level,rate,cost,value = "molemoney", name = "Mole Money", description = "mole' money, mole' problems") {
      this.name = name;
      this.level = level;
      this.rate = rate;
      this.cost = cost;
      this.description = description;
      this.value = value;
      this.tooltip = "<div>"+name+" (owned:"+level+")"
      +"<br>"+description+""
      +"<br>"+numbercleanup(cost)+"<img src='images/Mole_Color.png' height='20px' width='20px'></img> to upgrade"
      +"<br>"+numbercleanup(rate)+"<img src='images/Mole_Color.png' height='20px' width='20px'></img> per second for each "+name+""
      +"<br>"+numbercleanup(rate*level)+"<img src='images/Mole_Color.png' height='20px' width='20px'></img> per second total</div>"
    }
    up['molemoney'] = new upgradetype(0,1,10,'molemoney', 'Mole Money', "Mole' money, Mole' problems")
    up['moledating'] = new upgradetype(0,10,1000, 'moledating', 'Mole Dating Services', 'Find your mole mate')
    up['moletiplication'] = new upgradetype(0,100,10000, 'moletiplication', 'Moletiplication', 'Why are moles good at math?')
    up['moleblehomes'] = new upgradetype(0,1000,1000000, 'moleblehomes', 'Moleble Homes', 'Actually quite cozy')
    up['moleasses'] = new upgradetype(0,10000,1000000000, 'moleasses', 'Mole-asses', 'Hope that is not what I think it is')
    up['moleionare'] = new upgradetype(0,100000,10000000000, 'moleionare', 'Multi-mole-ionare', "You're rich, in moles anyways")
    up['molehawks'] = new upgradetype(0,5000000,1000000000000, 'molehawks', 'Mole Hawks', 'Rock and Mole!')
    up['guacamole'] = new upgradetype(0,100000000,1000000000000000, 'guacamole', 'Guacamole', "It's Avocado's Number")
    up['molecular'] = new upgradetype(0,1000000000,10000000000000000, 'molecular', 'Molecular Concetration', 'Teach the moles how to focus')
    up['molearchy'] = new upgradetype(0,100000000000,10000000000000000000, 'molearchy', 'Molearchy', 'Dwah, Who rules with an iron fist? <3')
    up['punishment'] = new upgradetype(0,1000000000000,1000000000000000000000, 'punishment', 'Pun-ishment', "No more! Please just stop!")
    // level array
    function  leveltype(level,back,mole = "images/Mole_Color.png", wave = "images/Color_Wave.png" ,name = "Moley",tag= "I'm a placeholder ^_^") {
      this.level = level;
      this.mole = mole;
      this.back = back;
      this.name = name;
      this.tag = tag;
      this.wave = wave;
    }
    levelarray = [
      new leveltype(0,"images/lab.png","images/Mole_B+W.png","images/Color_Wave.png"),
      new leveltype(1,"images/lab.png","images/Mole_B+W.png","images/Color_Wave.png"),
      new leveltype(2,"images/lab_color.png", "images/Mole_Color.png" ,"images/Color_Wave.png","Moley","Now in fabulous technicolor"),
      new leveltype(3,"images/field.png","images/Mole_Lab.png","images/Color_Wave.png","Lab Mole","It's not mad, it's Science!"),
      new leveltype(4,"images/field_color.png","images/Mole_Bit.png","images/Bit_Wave.png","Bit Mole","Photoshop filters, yay! ^_^"),
      new leveltype(5,"images/mountain.png","images/Mole_Hawk.png","images/xkcd_Wave.png","Mole Hawks","Rock N' Mole"),
      new leveltype(6,"images/mountain_color.png","images/Mole_Abstract.png","images/Abstract_Wave.png","Abstract","A slight mole-esque quaility"),
      new leveltype(7,"images/space.png","images/Mole_Crome.png","images/B+W_World_Wave.png","Crome Mole"),
      new leveltype(8,"images/space_color.png","images/Mole_Time.png","images/Color_World_Wave.png","Time Mole","Molebily Woobily Moleby Wooby Stuff!"),
    ];
// game length
    randomnews = [
      "6 times 10^23",
      "The mole the merrier",
      "A Mole-mole is a mole double agent",
      "Potatoes and mole-asses: not as good as the song implies",
      "Hole-y mole-y! It's a hole of mole-ies!",
      "Big numbers mean this game is educational, right?",
    ]
    Object.keys(up).forEach(function(key) {
      randomnews.push((up[key].name+": "+up[key].description))
    })
    if (gamelength == "Quick") {
      megamolerate = 12;
    } else if (gamelength == "Average") {
      megamolerate = 10;
    } else if (gamelength == "Mole-athon") {
      megamolerate = 6;
    }
		if (restoresave) {
			level = getCookie('level')
			playtime = getCookie('playtime')
			megamolerate = getCookie('megamolerate')
			Object.keys(up).forEach(function(key) {
				up[key].level = getCookie(key);
				for (var i = 0; i < up[key].level; i++) {
					up[key].cost = Math.round(up[key].cost*upgradecostmult)
				}
			})
			level -= 1
			levelup();
			totalmoles = getCookie('totalmoles')
		}
    statustext()
    $('#ScoreLine').show();
    upgradechecker();
    $('#MoleLevelIcon').attr('src', moleimg.src)
    $('#MoleLevelIcon').tooltip({content: "Mega Moletiplier: x"+numbercleanup(megamoletiplier)});

		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, speed);
    musicpicker();
	}

  function musicpicker(boss = false) {
    $("#MusicPlayer").attr("src", "8-bit-Arcade4.mp3");
    audio.volume = 0.2;
    if (musicmute == false) {audio.play()}
  }
// click actions
  function moleclick(x,y) {
    totalmoles += clickrate;
    if (totalmoles >= threshold) {totalmoles = threshold;}
    if (!soundmute) {clicksound();}
    statustext();
    spread = Math.floor(Math.random() * 20)-10
    moleclickicons.push({x: x, y: y,t: 0,spread: spread})
  }

// stats checker
  function statschecker(stat) {
    n = Math.random()*100
    if (n <= stat) {
      return true
    } else {
      return false
    }
  }
// game turn
  function gameturn() {
    playtime++;
    rotatelog++;
    if (rotatelog >= 30 ) {
      rotatelog = 0
			rot = Math.ceil(Math.random() * randomnews.length)
			console.log(randomnews.length);
			console.log(rot);
      $('#Log').html(randomnews[Math.ceil(Math.random() * randomnews.length)])
    }
    totalmoles += molerate;
    if (totalmoles >= threshold) {
      totalmoles = threshold;
      thresholdreached = true;
      $('#ThresholdButton').css("background-color", "yellow");
      $('#ThresholdButton').css("color", "red");
      $('#ThresholdButton').html("Pass the Thres-mole-d!!!");
    } else {
      thresholdreached = false;
      $('#ThresholdButton').css("background-color", "black");
      $('#ThresholdButton').css("color", "black");
      $('#ThresholdButton').html("Thres-mole-d: "+numbercleanup(threshold));
    }

    statustext();
    darkenbuttons();
    if (level > 6) {
      molewaveheight = Math.ceil(250-(totalmoles/(threshold*1.0))*200)
    } else {
      molewaveheight = Math.ceil(300-(totalmoles/(threshold*1.0))*250)
    }
  }

//paint and animate the canvas
	function paint() {
    ctx.drawImage(levelbackimg, 0,0,w,h)
    animateturns++;
    if (animateturns >= 10) {
      animateturns = 0
      gameturn();
    } else {
      statustext(Math.round(molerate*(animateturns/10.0)))
    }
    if (!gameon) {
      clearInterval(game_loop)
      return
    }
    if (levelscreen) {
      showlevelpage()
    } else {
      shake = flickering(shake[0],shake[1],Math.ceil(div*5.0),Math.ceil(div*5.0));
      if (!leveling) {context.drawImage(lightimg, (w/2)-(s/2)+shake[0], (h/4)-(s/2)+shake[0], s-shake[0], s-shake[0]);}
      moleiconmovement(animateturns);
      sprinkler();
      molewave(animateturns);
      if (leveling) {leveluptrans()}
      if (thresholdreached) {
        ctx.font = "40px Comic Sans MS";
        if (animateturns%3 == 0) {
          ctx.fillStyle = "yellow";
        } else {
          ctx.fillStyle = "red";
        }
        ctx.fillText("Thres-mole-d reached!", w/2 ,150);
        ctx.fillText("Maximum Mole-itude!", w/2 ,425);
      }
    }
	}
// graphical functions
  function molewave(aniturns){
    if (level > 6) {
      if (aniturns%2==0) {molewaveheight-= 1} else {molewaveheight += 1};
      ctx.drawImage(molewaveimg, 0, molewaveheight);
      if (level == 7) { crustimg.src = "images/space_crust.png"} else { crustimg.src = "images/space_crust_color.png"};
      ctx.drawImage(crustimg, 0, 405);
    } else {
      if (aniturns%2==0) {molewavewidth-= 4} else {use = molewavewidth+= 1};
      if (aniturns%2==0) {molewaveheight-= 1} else {molewaveheight += 1};
      ctx.drawImage(molewaveimg, molewavewidth,molewaveheight);
      if (molewavewidth <= -1000) {molewavewidth = 0};
    }
  }
  function drawarray(array,img,sx = 20, sy = 20) {
    for(var i = 0; i < array.length; i++) {
      context.drawImage(img, array[i].x, array[i].y, sx, sy);
    }
  }
  function leveluptrans(){
    s *= 1.40;
    context.drawImage(lightimg, (w/2)-(s/2)+shake[0], (h/4)-(s/2)+shake[0], s-shake[0], s-shake[0]);
    if (s >= 3000) {
      leveling = false;
      levelscreen = true;
      if (!soundmute) {levelscreensound.play();}
      levelup();
    }
  }
  function showlevelpage(){
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, w, h);
    ctx.font = "25px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    titlerotate = shaker(titlerotate[0],titlerotate[1],5)
    ctx.drawImage(lightimg, w/2-250,h/2-250,500,500)
    ctx.fillText("New Mole: "+levelarray[level].name, w/2 ,150);
    ctx.fillText(levelarray[level].tag, w/2 ,375);
    ctx.font = "15px Comic Sans MS";
    if (animateturns%2 == 0) {ctx.fillStyle = "yellow";} else {ctx.fillStyle = "white";}
    rotation(w/2,435)
    ctx.fillText("Mega Mole-tiplier is now: X"+megamoletiplier+"!", w/2 ,425);
    ctx.fillText("Click Rate now gains "+level+"% of Moles per second", w/2 ,450);
    ctx.restore();
    rotation(w/2,h/2)
    ctx.drawImage(moleimg, (w/2)-60,(h/2)-60,120,120);
    ctx.restore();
    rotation(w/2 ,50)
    ctx.font = "50px Arial";
    ctx.fillText("Level Up!", w/2 ,75);
    ctx.restore();
  }

  function flashing() {
    if (flash) {
      ctx.globalAlpha = 0.8;
    };
      flash = !flash
  };

  function pause(force = false) {
    if (!force) {
      pauseon = !pauseon
    } else if (force = "pause") {
      pauseon = true
    } else {
      pauseon = false
    }
    if (gameon) {
      if (pauseon) {
        clearInterval(game_loop);
        // logtext("Pause");
      } else {
        game_loop = setInterval(paint, speed);
        // logtext("Unpause");
      };
    }
  };
  function musictoggle() {
    musicmute = !musicmute
    audio = document.getElementById('MusicPlayer');
    // if (musicmute) { logtext("Music off")}
    if (!musicmute && !musicon) {
      audio.play();
      musicon = true;
      // logtext("Music on")
    } else {
      audio.pause();
      musicon = false;
    }
  };
// keystrokes
	// $(document).keydown(function(e){
	// 	var key = e.which;
  //   if (key == "32") pause();
  //   if (key == "77") musictoggle();
	// });

  function flickering(current,positive,n = 2, rate = 1) {
    if (current > n) {
      positive = false;
    } else if (current < (0-n)) {
      positive = true;
    }
    if (positive) {
      current+=rate;
    } else {
      current-=rate;
    }
    return [current, positive, n , rate]
  }
// upgrade button darkening
  function darkenbuttons() {
    Object.keys(up).forEach(function(key) {
      if (totalmoles >= up[key].cost*amountarray[currentammount].multi) {
         $("#"+up[key].value+"Button").css("opacity", "1")
       } else {
         $("#"+up[key].value+"Button").css("opacity", "0.5")
       }
    });
  }
// Buttons
  $("#StartButton").click(function(){
    if (!gameon) {
      instructionpageshow();
    };
  });
  $(document).on('click','#QuickButton',function(){
    gamelength = "Quick"
    $("#canvas").show();
    $("#PageText").hide();
    init();
  });
  $(document).on('click','#AverageButton',function(){
    gamelength = "Average"
    $("#canvas").show();
    $("#PageText").hide();
    init();
  });
  $(document).on('click','#LongButton',function(){
    gamelength = "Mole-athon"
    $("#canvas").show();
    $("#PageText").hide();
    init();
  });
	$(document).on('click','#ContinueButton',function(){
		restoresave = true;
		$("#canvas").show();
		$("#PageText").hide();
		init();
	});
  $(document).on('click','#HelpButton',function(){
    helpshow();
  });
  $(document).on('click','#CheatButton',function(){
    $('#DebugOptions').show();
    $("#canvas").show();
    $("#PageText").hide();
  });
  $(document).on('click','#NotCheatButton',function(){
    $("#canvas").show();
    $("#PageText").hide();
  });
  $("#MuteButton").click(function(){
    musictoggle();
  });
  $("#SoundMuteButton").click(function(){
    soundmute = !soundmute;
  });
  $("#PauseButton").click(function(){
    pause();
  });
  $(document).on('click','#ScientificNotationButton',function(){
    scientificnotation = !scientificnotation;
    if (scientificnotation) {
      $('#ScientificNotationButton').css('text-decoration', 'none')
      $('#ScientificNotationButton').css('color', 'black')
    } else {
      $('#ScientificNotationButton').css('text-decoration', 'line-through')
      $('#ScientificNotationButton').css('color', 'red')
    }
    upgradechecker();
  });
  $(document).on('click','#MoleLevelIcon',function(){
    if (gameon) {
      iconrotate--;
      if (iconrotate <= 0) {iconrotate = level}
      moleimg.src = levelarray[iconrotate].mole;
      $('#MoleLevelIcon').attr('src', moleimg.src)
      $('#MoleLevelIcon').tooltip({content: "Mega Moletiplier: x"+numbercleanup(megamoletiplier)});
    }
  });
  $(document).on('click','#BulkBuyButton',function(){
    currentammount++;
    if (currentammount >= 3) {currentammount = 0}
    $('#BulkBuyButton').html('x'+amountarray[currentammount].amount)
    upgradechecker();
    darkenbuttons();
  });
// upgrade buttons
  $(document).on('click','.UpgradeButtons',function(){
    if (totalmoles >= up[this.value].cost*amountarray[currentammount].multi) {
      totalmoles -= up[this.value].cost;
      array = buyupgrade(up[this.value].level,up[this.value].cost, amountarray[currentammount].amount)
      up[this.value].level = array[0];
      up[this.value].cost = array[1];
      moleratecal();
      statustext();
      darkenbuttons();
    }
    $('.ui-tooltip').hide();
  });
  function buyupgrade(uplevel,upcost,amount = 1) {
    for (var i = 0; i < amount; i++) {
      upcost = Math.round(upcost*upgradecostmult);
    }
    uplevel += amount;
    if (!soundmute) {upgradesound();}
    return [uplevel,upcost];
  }
// calculate mole rate
  function moleratecal() {
    molerate = 0;
    clickrate = 1;
    Object.keys(up).forEach(function(key) {
      molerate += (up[key].rate*up[key].level)
    })
    molerate *= megamoletiplier;
    clickrate *= megamoletiplier;
    clickrate += Math.floor(molerate*(level*0.01))
    upgradechecker();
    Object.keys(up).forEach(function(key) {
      up[key].tooltip = tooltipupdate(up[key])
    })
    div = (molerate/lightmax)
    if (div < 0.1) { div = 0.1}
    if (div > 1) { div = 1.0}
    s = Math.ceil(500.0 * div)
		saveScores();
  }
// threshold button and level up
  $(document).on('click','#ThresholdButton',function(){
    if (totalmoles == threshold) {
      leveling = true;
      if (!soundmute) {levelupsound.play();}
    }
  });
  function levelup(){
    level++;
    if (level > 8) {
      clearInterval(game_loop);
      currentpage = 0;
      gameon = false;
			leveling = false;
			setTimeout(context.drawImage(end1img, 0,0,w,h), 1000);
      gamewin = true;
      endpages();
    } else {
      megamoletiplier = Math.pow(megamolerate,(level-1));
      $('#MultiInfo').html("x"+numbercleanup(megamoletiplier))
      if (level == 8) {
        threshold = 602214129000000000000000
      } else {
        threshold = Math.pow(1000,level);
      }
      totalmoles = 0;
      levelbackimg.src = levelarray[level].back;
      moleimg.src = levelarray[level].mole;
      molewaveimg.src = levelarray[level].wave;
      moleclickicons = [];
      iconrotate = level;
      sprinkly = Math.ceil(18-(2 * level));
      lightmax = threshold/(20.0*level);
      moleratecal();
      darkenbuttons();
      $('#MoleLevelIcon').attr('src', moleimg.src)
      $('#MoleLevelIcon').tooltip({content: "Mega Moletiplier: x"+numbercleanup(megamoletiplier)});
		}
  }
// make the numbers pretty
  function numbercleanup(n, full = false) {
    numbersuffixlong = [ '','Million','Billion','Trillion','Quadrillion','Quintillion','Sextillion']
    numbersuffix = ['','M','B','T','Qa','Qi','Sx']
    sn = (n).toString();
    if (n < 1000000) {
      return (Math.floor(n)).toString();
    } else if (sn.includes('e')) {
      mult = parseInt(sn.slice(-2))
      sn = (parseFloat(sn.slice(0, -4))*Math.pow(10,(mult%3))).toFixed(3).toString()
      mult++;
    } else {
      mult = sn.length
      left = (mult%3)
      if (left == 0) {left = 3}
      sn = (n/Math.pow(10,(mult-left))).toFixed(3).toString()
    }
    if (full) {sn = sn  +" "+ numbersuffixlong[Math.floor((mult-1)/3.0)-1]} else {sn = sn  +" "+ numbersuffix[Math.floor((mult-1)/3.0)-1]}
    if (scientificnotation) {
      sn = (n/Math.pow(10,(mult-1))).toFixed(3).toString()+" x 10^"+(mult-1)
    }
    console.log(mult);
    return sn
  };
// Status text
  function statustext(aninum = 0) {
    if (totalmoles == threshold) {aninum = 0};
    $('#TimeKeeper').html(" "+timemaker(playtime)+" ")
    $('#Score').html(numbercleanup(totalmoles+aninum,true))
  };
// add upgradebuttons
  function buttonmaker(upgrade) {
    return "<button title='' class='UpgradeButtons' id='"+upgrade.value+"Button' value='"+upgrade.value+"'><div center='right'>("+upgrade.level+")"+upgrade.name+"</div> "+numbercleanup(upgrade.cost*amountarray[currentammount].multi)+" <img src='images/Mole_Color.png' style='width: 15px;height: 15px'></img></button><br><br>"
  }
  function upgradechecker(array = []) {
    array += "<a id='SubMoleLine'>"+numbercleanup(molerate)+" a sec|"+numbercleanup(clickrate)+" a click</a>"
    Object.keys(up).forEach(function(key) {
      array += buttonmaker(up[key])
    });
    array += "<button id='ThresholdButton'>Thres-mole-d: "+numbercleanup(threshold)+"</button>"
    $('#StatusText').html(array)
    if (level < 2) { $('#moledatingButton').hide() }
    if (level < 2) { $('#moletiplicationButton').hide() }
    if (level < 3) { $('#moleblehomesButton').hide() }
    if (level < 4) { $('#moleassesButton').hide() }
    if (level < 4) { $('#moleionareButton').hide() }
    if (level < 5) { $('#molehawksButton').hide() }
    if (level < 6) { $('#guacamoleButton').hide() }
    if (level < 6) { $('#molecularButton').hide() }
    if (level < 7) { $('#molearchyButton').hide() }
    if (level < 8) { $('#punishmentButton').hide() }
    $( function() {
      $(document).tooltip();
      $('#molemoneyButton').tooltip({content: up['molemoney'].tooltip});
      $('#moledatingButton').tooltip({content: up['moledating'].tooltip});
      $('#moletiplicationButton').tooltip({content: up['moletiplication'].tooltip});
      $('#moleblehomesButton').tooltip({content: up['moleblehomes'].tooltip});
      $('#molehawksButton').tooltip({content: up['molehawks'].tooltip});
      $('#molecularButton').tooltip({content: up['molecular'].tooltip});
      $('#moleionareButton').tooltip({content: up['moleionare'].tooltip});
      $('#molearchyButton').tooltip({content: up['molearchy'].tooltip});
      $('#punishmentButton').tooltip({content: up['punishment'].tooltip});
      $('#guacamoleButton').tooltip({content: up['guacamole'].tooltip});
      $('#moleassesButton').tooltip({content: up['moleasses'].tooltip});
      $(".ui-helper-hidden-accessible").hide();
     });
  }
//tooltips
  $( function() {
    $(document).tooltip();
    $(".ui-helper-hidden-accessible").hide();
   });
	 function tooltipupdate(name){
		 return "<div>"+name.name+" (owned:"+name.level+")"
		 +"<br>"+name.description+""
		 +"<br>"+numbercleanup(name.cost)+"<img src='images/Mole_Color.png' height='20px' width='20px'></img> to upgrade"
		 +"<br>"+numbercleanup(name.rate*megamoletiplier)+"<img src='images/Mole_Color.png' height='20px' width='20px'></img> per second for each "+name.name+""
		 +"<br>"+numbercleanup(name.rate*name.level*megamoletiplier)+"<img src='images/Mole_Color.png' height='20px' width='20px'></img> per second total</div>"
	 }
// time translation
  function timemaker(n) {
    seconds = (n%60).toString();
    minutes = (Math.floor(n/60.0)%60).toString();
    hours = (Math.floor(n/3600.0)).toString();
    if (seconds.length == 1) {seconds = "0"+ seconds }
    if (minutes.length == 1) {minutes = "0"+ minutes }
    if (hours.length == 1) {hours = "0"+ hours }
    return hours+":"+minutes+":"+seconds
  }
// mole hole switch
  function moleholeswitch(){
    lightarray = ["images/lights/Black_Light.png",
                  "images/lights/Blue_Light.png",
                  "images/lights/Green_Light.png",
                  "images/lights/Pink_Light.png",
                  "images/lights/Red_Light.png",
                  "images/lights/White_Light.png",
                  "images/lights/Yellow_Light.png",
    ]
    curlight++;
    if (curlight > 6) { curlight = 0}
    lightimg.src = lightarray[curlight]
    $('#LightChangeButton').attr("src", lightimg.src);
  }
  $(document).on('click','#LightChangeButton',function(){
    moleholeswitch();
  });
// debug options
  function skipturns(n) {
    for (var i = 0; i < n; i++) {
      gameturn();
    }
  }
  $("#HourSkipButton").click(function(){
    skipturns(3600);
  });
  $("#MinuteSkipButton").click(function(){
    skipturns(60);
  });
  $("#BigNumberButton").click(function(){
    scientificnotation = true;
    molerate = 602214129000000000000000;
    threshold = 99999999999999999999999999999999999999999999;
    console.log(numbercleanup(602214129000000000000000,true));
    console.log(numbercleanup(60221412900000000000000));
    console.log(numbercleanup(6022141290000000000000));
    console.log(numbercleanup(602214129000000000000,true));
    console.log(numbercleanup(60221412900000000000,true));
    numbery = 10
    sum = 0
    for (var i = 0; i < 100; i++) {
      sum += numbery;
      numbery *= 1.15;
    }
    console.log(sum);
    console.log(sum/10);
  });
  $("#ForceLevelButton").click(function(){
    leveling = true;
    levelupsound.play();
  });
  $("#SimulateGameButton").click(function(){
    simulation();
  });
  $("#OptimumGameButton").click(function(){
    simulation(true);
  });
  $("#ForceThresholdButton").click(function(){
    totalmoles += 700000000000000000000000;
  });
  $("#RateButton").click(function(){
    molerate *= 10;
  });
// game simulation estimates
  function simulation(opt = false) {
    init();
    clearInterval(game_loop);
    thresbreak = [0]
		megamolerate = 12;
    for (var i = 0; i < 345600; i++) {
      gameturn();
      totalmoles += clickrate;
      nextthres = Math.ceil((threshold-totalmoles)/molerate)
      if (totalmoles >= 602214129000000000000000) {break;};
      if (totalmoles >= threshold) {
        thresbreak.push(i);
        levelup();
      };
      Object.keys(up).forEach(function(key) {
        newthres = Math.ceil((threshold-(totalmoles-up[key].cost))/(molerate+(up[key].rate*megamoletiplier)))
        practical = Math.ceil(up[key].cost/(up[key].rate*megamoletiplier))
        sixhours = 21600
        if (opt) {
          practical = newthres;
          sixhours = nextthres;
        }
        if (totalmoles >= up[key].cost && practical <= sixhours) {
          totalmoles -= up[key].cost;
          array = buyupgrade(up[key].level,up[key].cost)
          up[key].level = array[0];
          up[key].cost = array[1];
          moleratecal();
        };
      });
    };
    array = ["Moles = "+numbercleanup(totalmoles,true)+" ("+numbercleanup(molerate)+" per sec) Clickrate:"+numbercleanup(clickrate)]
    for (var i = 0; i < thresbreak.length; i++) {
      array.push("<br><br>"+(i)+" = "+timemaker(thresbreak[i])+"(+"+timemaker(thresbreak[i]-thresbreak[i-1])+")")
    };
    $('#Score').html(array)
  };

// Cookies
  function setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays*24*60*60*1000));
      var expires = "expires="+d.toGMTString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
  };

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        };
        if (c.indexOf(name) == 0) {
            return parseInt(c.substring(name.length, c.length));
        };
    };
    return 0;
  };
  function saveScores() {
    Object.keys(up).forEach(function(key) {
      setCookie((key).toString(), up[key].level, 365);
    })
    setCookie("level", level, 365);
    setCookie("playtime", playtime, 365);
    setCookie("totalmoles", totalmoles, 365);
		setCookie("megamolerate", megamolerate, 365);
  };
});
