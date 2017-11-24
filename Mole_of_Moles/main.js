/*
Idle Game Maker by Orteil
all rights reserved etc

TODO :
|	-complete the whole basic parser
|	-saving, loading, resetting
|		-format saves using explicit variable names like "cookies:23455;" so we can reorder our elements as we wish
|	-tooltips
|	-speed/performance issues
	-stats screen
	-settings screen
	-author's update log
|	-custom CSS (give special classes to each button)
	-custom blocks arranging
	-custom buttons that toggle blocks on/off
	-CSS-less images for buildings, clickables, upgrades and resources
|	-average Xps calculator
	-clicked total, earned total (display in stats and use as unlock requirement)
|	-particles
	-item orders
	-research system
	-golden cookie system
	-random event system
	-ascension system
|	-achievement system
	-ticker
	-quick reskinner system (just put in building names and you get a cookie-cutter game)
|	-ads
	-policies (don't hide the ads yo)
	-give an option for disabling goodle ads if your game contains adult content
	-quick how-to guide for creating new games
	-strip html, sanitize all input, error-check everything (or not ? perhaps a policy of "do what you want but don't break it")
	-warnings ("tried to destroy a building named X, but no building named X exists", "tried to create a new upgrade named X but a clickable named X already exists", "tried to create a new building with identifier X but identifiers cannot contain spaces")
	-bug : buildings not changing prices when added/removed
	-bug : "multiplies power" not working as intended

Complete list of commands :
-General rules
|	-text after a * defines the identifier of a new item, which you can use to refer to it in other items; do not change this identifier once you set it as this would mess up saved games
|	-identifiers cannot contain spaces or special characters; please write things such as "Slay monster" as "SlayMonster" or "Slay_monster"
|	-you can change the displayed name of an item to whatever you wish by setting its using the "named" command - for example : named Slay monster
|	-you can use the "named" command to set a plural too (for resources and buildings), like so : named cookie|cookies
|	-feel free to rearrange items as you like
|	-text between quotes "***" defines the description for the current item
|	-lines beginning with // are comments and are ignored by the game
|	-"image : ***" sets the element's picture to the specified url. This might behave differently depending on the element's type.
|	-"hidden|visible" makes an element visible or hidden by default
|	-"abstract" means an element is never displayed (use that for hidden elements that affect the gameplay without being clickable/purchasable)
|	-"classed ***,***,***" adds CSS classes to the element
-the 1st line is always the name of the game and begins the "main" section (note : changing the name of your game will reset everyone's save)
|	-by X
|		-sets the author
|	-created on X
|	-last updated on X
|	-version X
-"Settings :" begins the "settings" section
|	-prices increase by X% ("110%" would mean each building is 10% more expensive than the previous one)
|	-selling gives back X%
|	-resources are hidden|visible by default
|	-clickables are hidden|visible by default
|	-buildings are hidden|visible by default
|	-upgrades are hidden|visible by default
|	-achievements are hidden|visible by default
|	-show|hide log
|		-this displays or hides the debug log
|	-background : X
|		-sets your game's background to the specified url
|	-text color : X
|		-sets your game's text color to the specified color name or hex code
|	-fonts : X, X, X...
|		-loads google webfonts for use in CSS rules
|	-custom stylesheet : X
|		-your game will get its custom CSS from that url (needs to be a text file)
-"Resources :" begins the "resources" section
|	-*X
|		-begins a new resource
|	-starts at X
|		-defines the starting amount of the resource
|	-hidden|visible
|		-any resources of which you have more or less than 0 is visible, unless enforced by this rule
|	-visible at X Y
|		-the item is only visible when resource X is above Y
|	-displayed as X
|		-gives a custom display string for this resource, where %a is replaced by the amount and %s displays an "s" if the amount is different from 1 (example : "You have %a cookie%s")
|	-show X digits
|		-how many digits should be behind the floating point
-"Clickables :" begins the "clickables" section
|	-*X
|		-begins a new clickable
|	-[any power]
|	-unlocks with X
|		-unlocks when another building/upgrade is unlocked
|	-unlocks at X Y
|		-unlocks when you have at least X of resource/building Y
|	-gains X% per Y
|		-the clickable's resource-producing powers gain +X% multiplied by the amount of resource/building Y
|	-hidden|visible
|		-whether or not the clickable is visible by default
|	-visible at X Y
|		-the item is only visible when resource X is above Y
|	-says X
|		-show a notification containing X when this clickable is clicked
|	-on failure says X
|		-same, but only when this clickable's chances failed
|	-on success says X
|		-same, but only when this clickable's chances succeeded
-"Buildings :" begins the "buildings" section
|	-*X
|		-begins a new building
|	-[any power]
|	-represents X Y
|		-each of this building grants a passive X amount of resource Y
|	-occupies X Y
|		-each of this building takes up X of resource Y (which is freed when the building is sold)
|	-requires X Y
|		-can only be built if we have at least X of resource/building Y
|	-requires X
|		-can only be built if we have the upgrade X
|	-costs X Y
|		-uses X of resource/building Y to be built (will be rounded up if it's a building)
|	-price increases by X%
|		-sets the price increase ratio for this building only
|	-unlocks with X
|		-unlocks when another building/upgrade is unlocked
|	-unlocks at X Y
|		-unlocks when you have at least X of resource/building Y
|	-gains X% per Y
|		-the building's resource-producing powers gain +X% multiplied by the amount of resource/building Y
|	-starts at X
|		-defines the starting amount of the building
|	-hidden|visible
|		-any buildings of which you have more or less than 0 is visible, unless enforced by this rule
|	-visible at X Y
|		-the item is only visible when resource X is above Y
-"Upgrades :" begins the "upgrade" section
|	-*X
|		-begins a new upgrade
|	-[any power]
|	-multiplies efficiency of X by Y%
|		-having the upgrade amplifies the powers of building/clickable X by Y%
|	-multiplies efficiency of X by Y% per Z
|		-having the upgrade amplifies the powers of building/clickable X by Y% multiplied by the amount of resource/building Z
|	-multiplies income of X by Y%
|		-having the upgrade multiplies any income of resource X by Y%
|	-requires X Y
|		-can only be built if we have at least X of resource/building Y
|	-requires X
|		-can only be built if we have the upgrade X
|	-unlocks X
|		-unlocks the clickable/building/upgrade X
|	-locks X
|		-locks the clickable/building/upgrade X (use this to have the player make a choice between different upgrades, for example)
|	-converts X to Y
|		-converts a resource/clickable/building X to Y (keeps the amount and multiplier)
|	-costs X Y
|		-uses X of resource/building Y to be built
|	-unlocks with X
|		-unlocks when another building/upgrade is unlocked
|	-unlocks at X Y
|		-unlocks when you have at least X of resource/building Y
|	-hidden|visible
|		-visible makes the upgrade unlocked by default
|	-visible at X Y
|		-the item is only visible when resource X is above Y
-"Achievements :" begins the "achievements" section
|	-*X
|		-begins a new achievement
|	-unlocks with X
|		-unlocks when another building/upgrade is unlocked
|	-unlocks at X Y
|		-unlocks when you have at least X of resource/building Y
|	-hidden|visible
|		-visible makes the achievement visible by default
-Power commands :
|	-gives X Y
|		-the object gives amount X of resource Y per click/second
|	-gives X>X2 Y
|		-same as above, but gives a random amount between X and X2
|	-gives Xa Ya,Xb Yb,Xc Yc...
|		-gives multiple types of resources (can be mixed with other syntaxes)
|	-takes X Y
|		-the object takes amount X of resource Y per click/second (if Y is above 0)
|	-builds X Y
|		-the object creates amount X of building Y per click/second
|	-destroys X Y
|		-the object destroys amount X of building Y per click/second (if Y is above 0)
|	-multiplies X Y%
|		-the object multiplies the resource/building X by Y% one time (rounded up if it's a building)
|	-grants X Y
|		-the object gives a one-time bonus of X of resource Y
|	-*** N% of the time
|		-the power only takes effect a percent of the time
|	-*** for Xb Yb
|		-the power only takes effect if we have at least Xb of resource/building Yb, and uses that amount in the process
|	-*** requiring Xb Yb
|		-the power only takes effect if we have at least Xb of resource/building Yb
|	-*** when bought
|		-the power only takes effect when it's a building or upgrade and it is being bought
|	-*** when sold
|		-the power only takes effect when it's a building or upgrade and it is being sold

*/
function l(what){return document.getElementById(what);}
function choose(arr) {return arr[Math.floor(Math.random()*arr.length)];}

function escapeRegExp(str){return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");}
function replaceAll(find,replace,str){return str.replace(new RegExp(escapeRegExp(find),'g'),replace);}

function sanitize(str)//when we only want to allow certain html tags
{
    var tags='b|i|u|q';//only accept these
    return str.replace(new RegExp('<(/?[^i|b])>','gi'),'&lt;$1&gt;');
}

function beginsWith(me,what){return (me.indexOf(what)==0);}
function Cap(str){return str.charAt(0).toUpperCase()+str.slice(1);}

function Beautify(what,floats)//turns 9999999 into 9,999,999
{
	var str='';
	if (!isFinite(what)) return 'Infinity';
	if (what.toString().indexOf('e')!=-1) return what.toString();
	what=Math.round(what*10000000)/10000000;//get rid of weird rounding errors
	if (floats>0)
	{
		var floater=what-Math.floor(what);
		floater=Math.round(floater*10000000)/10000000;//get rid of weird rounding errors
		var floatPresent=floater?1:0;
		floater=(floater.toString()+'0000000').slice(2,2+floats);//yes this is hacky (but it works)
		if (parseInt(floater)===0) floatPresent=0;
		str=Beautify(Math.floor(what))+(floatPresent?('.'+floater):'');
	}
	else
	{
		what=Math.floor(what);
		what=(what+'').split('').reverse();
		for (var i in what)
		{
			if (i%3==0 && i>0) str=','+str;
			str=what[i]+str;
		}
	}
	return str;
}

function ajax(url,callback){
	var ajaxRequest;
	try{ajaxRequest = new XMLHttpRequest();} catch (e){try{ajaxRequest=new ActiveXObject('Msxml2.XMLHTTP');} catch (e) {try{ajaxRequest=new ActiveXObject('Microsoft.XMLHTTP');} catch (e){alert("Something broke!");return false;}}}
	if (callback){ajaxRequest.onreadystatechange=function(){if(ajaxRequest.readyState==4){callback(ajaxRequest.responseText);}}}
	ajaxRequest.open('GET',url+'&nocache='+(new Date().getTime()),true);ajaxRequest.send(null);
}

function getElementsByClassName(node,classname) {
  if (node.getElementsByClassName) { // use native implementation if available
    return node.getElementsByClassName(classname);
  } else {
    return (function getElementsByClass(searchClass,node) {
        if ( node == null )
          node = document;
        var classElements = [],
            els = node.getElementsByTagName("*"),
            elsLen = els.length,
            pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)"), i, j;

        for (i = 0, j = 0; i < elsLen; i++) {
          if ( pattern.test(els[i].className) ) {
              classElements[j] = els[i];
              j++;
          }
        }
        return classElements;
    })(classname, node);
  }
}

function AddEvent(html_element, event_name, event_function)
{
	if(html_element.attachEvent)//Internet Explorer
		html_element.attachEvent("on" + event_name, function() {event_function.call(html_element);});
	else if(html_element.addEventListener)//Firefox & company
		html_element.addEventListener(event_name, event_function, false);//don't need the 'call' trick because in FF everything already works in the right way
}

function AddClass(who,what)
{
	var str='[ '+who.className+' ]';
	if (str.indexOf(' '+what+' ')==-1) who.className=who.className+=' '+what;
}
function RemoveClass(who,what)
{
	var str='[ '+who.className+' ]';
	if (str.indexOf(' '+what+' ')!=-1) {str=str.replace(' '+what+' ',' ');str=str.replace('[ ','');str=str.replace(' ]','');who.className=str;}
}

function getUrlVars()
{
	var vars={};
	var parts=window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
	function(m,key,value)
	{
		vars[key]=value;
	});
	return vars;
}

function escapeHtml(str)
{
	var div=document.createElement('div');
	div.appendChild(document.createTextNode(str));
	return div.innerHTML;
};

function utf8_to_b64( str ) {
	try{return Base64.encode(unescape(encodeURIComponent( str )));}
	catch(err){return '';}
}

function b64_to_utf8( str ) {
	try{return decodeURIComponent(escape(Base64.decode( str )));}
	catch(err){return '';}
}

Game={};
Game.ready=0;
Game.Init=function()
{
	Game.ready=1;
	/*=====================================================================================
	VARS AND TOOLS
	=======================================================================================*/
	Game.log=l('log');
	Game.Log=function(what){Game.log.innerHTML='<div>'+what+'</div>'+Game.log.innerHTML;}
	Game.Log('Idle Game Maker is currently in super-early alpha.');
	Game.showLog=0;
	
	Game.fps=30;
	Game.T=0;
	Game.steps=2;//Game.fps;
	//latency compensator stuff
	Game.time=new Date().getTime();
	Game.fpsMeasure=new Date().getTime();
	Game.accumulatedDelay=0;
	Game.catchupLogic=0;
	
	Game.name='Unknown';
	Game.madeBy='Unknown';
	
	Game.boxes=['main','store','stats'];
	Game.defaultBoxes={'title':'main','save':'store','resource':'main','clickable':'main','building':'store','upgrade':'store','achievement':'stats','support':'store'};
	Game.background='';
	Game.textColor='';
	Game.fonts=[];
	
	Game.priceIncrease=1.1;
	Game.sellPrice=0.5;
	
	Game.sayUnlocks=1;
	Game.sayWons=1;
	
	/*=====================================================================================
	GET GAME SOURCE
	=======================================================================================*/
	
	Game.urlVars=getUrlVars();
	Game.debug=parseInt(Game.urlVars.debug||0);
	Game.src=Game.urlVars.game||'';
	Game.css='';
	Game.cssData='';
	if (Game.src=='') {Game.Say('No game selected.');Game.Log('No game selected.');}
	else if (Game.src.indexOf('www.')==-1 && Game.src.indexOf('http://')==-1 && Game.src.indexOf('https://')==-1) Game.src='http://pastebin.com/raw.php?i='+Game.src;
	
	Game.FetchGame=function()
	{
		Game.Log('Loading game at '+Game.src+'...');
		ajax('server.php?q=getgame|'+Game.src,Game.FetchGameResponse);
	}
	Game.FetchGameResponse=function(response)
	{
		if (Game.src!='')
		{
			Game.Log('Loaded game. Parsing...');
			Game.ParseData(response);
			Game.Log('Parsed '+Game.lines+' lines.');
		}
		if (Game.css!='') Game.FetchCSS(); else Game.Launch();
	}
	
	Game.FetchCSS=function()
	{
		Game.Log('Loading custom stylesheet at '+Game.css+'...');
		ajax('server.php?q=getcss|'+Game.css,Game.FetchCSSResponse);
	}
	Game.FetchCSSResponse=function(response)
	{
		Game.cssData=escapeHtml(response);
		if (Game.cssData!='')
		{
			Game.Log('Loaded stylesheet.');
			var css=document.createElement('style');
			css.type='text/css';
			Game.cssData=replaceAll('#topBar','#unrecognized',Game.cssData);
			Game.cssData=replaceAll('#support','#unrecognized',Game.cssData);
			css.innerHTML=Game.cssData;
			document.getElementsByTagName('head')[0].appendChild(css);
		}
		Game.Launch();
	}
	
	
	/*=====================================================================================
	MOUSE
	=======================================================================================*/
	Game.mouseX=0;
	Game.mouseY=0;
	Game.GetMouseCoords=function(e)
	{
		var posx=0;
		var posy=0;
		if (!e) var e=window.event;
		if (e.pageX||e.pageY)
		{
			posx=e.pageX;
			posy=e.pageY;
		}
		else if (e.clientX || e.clientY)
		{
			posx=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
			posy=e.clientY+document.body.scrollTop+document.documentElement.scrollTop;
		}
		var el=l('gameWrapper');
		var x=0;
		var y=0;
		while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop))
		{
			x+=el.offsetLeft-el.scrollLeft;
			y+=el.offsetTop-el.scrollTop;
			el=el.offsetParent;
		}
		Game.mouseX=posx-x;//Math.min(Game.w,Math.max(0,posx-x));
		Game.mouseY=posy-y;//Math.min(Game.h,Math.max(0,posy-y));
	}
	AddEvent(document,'mousemove',Game.GetMouseCoords);


	/*=====================================================================================
	TOOLTIP
	=======================================================================================*/
	Game.tooltip={text:'',on:0};
	Game.tooltip.draw=function(from,text,obj)
	{
		this.text=text;
		var tt=l('tooltip');
		var tta=l('tooltipAnchor');
		tta.style.display='block';
		tt.style.left='auto';
		tt.style.top='auto';
		tt.style.right='auto';
		tt.style.bottom='auto';
		tt.style.right='8px';
		tt.style.top='8px';
		if (obj) tt.innerHTML=Game.things[obj].Tooltip(); else tt.innerHTML=unescape(text);
		this.on=1;
	}
	Game.tooltip.hide=function()
	{
		l('tooltipAnchor').style.display='none';
		this.on=0;
	}
	Game.tooltip.update=function()
	{
		var tt=l('tooltip');
		var tta=l('tooltipAnchor');
		tta.style.left=Game.mouseX+'px';
		tta.style.top=Game.mouseY+'px';
	}
	Game.GetTooltip=function(text)
	{
		return 'onMouseOut="Game.tooltip.hide();" onMouseOver="Game.tooltip.draw(this,\''+escape(text)+'\');"';
	}
	Game.GetObjTooltip=function(obj)
	{
		return 'onMouseOut="Game.tooltip.hide();" onMouseOver="Game.tooltip.draw(this,\'\',\''+obj.key+'\');"';
	}
	
	/*=====================================================================================
	NOTIFICATIONS
	=======================================================================================*/
	
	Game.popups=[];
	Game.popupsById=[];
	Game.popupId=0;
	Game.popupL=l('popups');
	Game.Popup=function(text,pic)
	{
		this.text=text;
		this.pic=pic||'';
		this.id=Game.popupId;
		this.date=new Date().getTime();
		Game.popupId++;
		Game.popupsById[this.id]=this;
		Game.popups.push(this);
		if (Game.popups.length>50) Game.popups.shift();
		Game.UpdatePopups();
	}
	Game.ClosePopup=function(id)
	{
		var me=Game.popupsById[id];
		Game.popups.splice(Game.popups.indexOf(me),1);
		Game.UpdatePopups();
	}
	Game.UpdatePopups=function()
	{
		var str='';
		var remaining=Game.popups.length;
		for (var i in Game.popups)
		{
			if (i<5)
			{
				var me=Game.popups[i];
				str='<div id="popup-'+me.id+'" class="popup'+(me.pic!=''?' haspic':'')+'"><div class="close" onclick="Game.ClosePopup('+me.id+');">x</div>'+(me.pic!=''?'<img src="'+this.pic+'" class="icon"/>':'')+'<div class="text">'+me.text+'</div></div>'+str;
				remaining--;
			}
		}
		if (remaining>0) str='<div class="remaining">+'+remaining+' more notification'+(remaining==1?'':'s')+'.</div>'+str;
		Game.popupL.innerHTML=str;
	}
	Game.Say=function(text,pic)
	{
		new Game.Popup(text,pic);
	}
	
	/*=====================================================================================
	PARTICLES
	=======================================================================================*/
	
	Game.particles=[];
	Game.Particle=function()
	{
		this.id=Game.particles.length;
		Game.particles[this.id]=this;
	}
	var str='';
	for (var i=0;i<50;i++)
	{
		var me=new Game.Particle();
		str+='<div class="particle" id="particle-'+me.id+'"></div>';
	}
	l('particles').innerHTML=str;
	for (var i in Game.particles)
	{
		Game.particles[i].l=l('particle-'+Game.particles[i].id);
	}
	
	Game.particlesRoll=0;
	Game.PopNumber=function(el,text)
	{
		var me=Game.particles[Game.particlesRoll];
		var rect=el.getBoundingClientRect();
		me.l.style.marginLeft=Math.floor(Math.random()*(rect.right-rect.left)+rect.left-75)+'px';
		me.l.style.marginTop=Math.floor(Math.random()*(rect.bottom-rect.top)+rect.top-25)+'px';
		me.l.style.animation='';
		if (me.timer) clearTimeout(me.timer);
		me.l.innerHTML=text;
		me.timer=setTimeout(function(element){return function(event){element.innerHTML='';}}(me.l),1000);
		setTimeout(function(element){return function(event){element.style.animation='rise 2s normal forwards ease-out';}}(me.l),1);
		Game.particlesRoll=(Game.particlesRoll+1)%50;
	}
	
	
	/*=====================================================================================
	THINGS
	=======================================================================================*/
	
	Game.res=[];//resources
	Game.resourceDisplayString='%a %r';
	Game.clickables=[];
	Game.buildings=[];
	Game.upgrades=[];
	Game.achievements=[];
	Game.things=[];//all the things
	
	Game.FindThing=function(what,shouldntExist)//returns the resource, clickable, building, upgrade or achiev with that identifier
	{
		var me=Game.things[what];
		/*
		var me=Game.res[what];
		if (!me) me=Game.clickables[what];
		if (!me) me=Game.buildings[what];
		if (!me) me=Game.upgrades[what];
		if (!me) me=Game.achievements[what];
		*/
		if (!me) me=0;
		if (!me && !shouldntExist) Game.Log('Error : the element named "'+(what)+'" was not found.');
		return me;
	}
	
	Game.Res=function(name)
	{
		this.type='resource';
		this.id=Game.res.length;
		this.key=name;
		this.name=name;
		this.plural=this.name;
		this.description='';
		this.displayString=Game.resourceDisplayString||'%a %r';
		this.powers=[];
		this.amount=0;
		this.amountTotal=0;
		this.startsWith=0;
		this.visibleDefault=0;
		this.visible=0;
		this.digits=0;//digits shown after comma
		this.unlocks=[];
		this.unlocksFrom=[];
		this.unlocksAt=[];
		this.visibleAt=[];
		this.getMessage='';
		this.augments=[];
		this.multiplier=1;
		this.classes=[];
		this.real=1;
		this.pic='';
		
		this.samples=[0,0,0,0,0];
		this.lastAmount=0;
		this.computedPS=0;//how much do we get per second on average?
		this.Sample=function()//estimate how much we're making every second
		{
			this.samples.unshift(this.amount-this.lastAmount);
			this.samples.pop();
			this.computedPS=0;
			for (var i in this.samples)
			{
				this.computedPS+=this.samples[i];
			}
			this.computedPS/=5;
			this.lastAmount=this.amount;
		}
		
		this.GetAmount=function(what)
		{
			var what=(typeof what==='undefined'?this.amount:what);
			return Beautify(what,this.digits);//Math.floor(what*Math.pow(10,this.digits))/Math.pow(10,this.digits);
		}
		this.GainPower=function(what)
		{
			this.powers.push(what);
		}
		this.Unlock=function()
		{
			if (this.visible<=0)
			{
				this.visible=1;
				for (var i in this.unlocks) {this.unlocks[i].Unlock();}
			}
		}
		this.Lock=function()
		{
			if (this.visible>0)
			{
				this.visible=0;
			}
		}
		this.RefreshCosts=function()
		{
		}
		
		Game.res[this.key]=this;
		Game.things[this.key]=this;
	}
	
	Game.Clickable=function(name)
	{
		this.type='clickable';
		this.id=Game.clickables.length;
		this.key=name;
		this.name=name;
		this.description='';
		this.powers=[];
		this.requires=[];
		this.costs=[];
		this.visibleDefault=1;
		this.visible=1;
		this.clicked=0;
		this.locks=[];
		this.unlocks=[];
		this.unlocksFrom=[];
		this.unlocksAt=[];
		this.visibleAt=[];
		this.converts=[];
		this.message=[];
		this.winMessage=[];
		this.failMessage=[];
		this.augments=[];
		this.multiplier=1;
		this.multipliedBy=[];
		this.classes=[];
		this.real=1;
		this.pic='';
		
		this.Click=function()
		{
			var success=1;
			var given=[];
			var taken=[];
			for (var i in this.requires)
			{
				if (this.requires[i].X<this.requires[i].amount) success=0;
			}
			if (success)
			{
				for (var i in this.powers)
				{
					var returned=this.powers[i]();
					if (returned.fail) success=0;
					for (var ii in returned.gave)
					{
						given.push(returned.gave[ii]);
					}
					for (var ii in returned.took)
					{
						taken.push(returned.took[ii]);
					}
				}
			}
			if (success)
			{
				for (var i in this.converts)
				{
					if (this.converts[i].X.type=='clickable' || this.converts[i].Y.type=='clickable')
					{
						this.converts[i].X.Lock();
						this.converts[i].Y.Unlock();
						this.converts[i].Y.clicked+=this.converts[i].X.clicked;
						this.converts[i].X.clicked=0;
					}
					else
					{
						this.converts[i].Y.amount+=this.converts[i].X.amount;
						this.converts[i].X.amount=0;
						this.converts[i].X.RefreshCosts();
						this.converts[i].Y.RefreshCosts();
						//this.converts[i].X.visible=0;
						//this.converts[i].Y.visible=1;
					}
				}
				for (var i in this.unlocks) {this.unlocks[i].Unlock();}
				for (var i in this.locks) {this.locks[i].Lock();}
				var str='';
				for (var i in given)
				{
					str+='+'+given[i].X.GetAmount(given[i].amount)+' '+(given[i].amount==1?given[i].X.name:given[i].X.plural)+'<br>';
				}
				for (var i in taken)
				{
					str+='-'+taken[i].X.GetAmount(taken[i].amount)+' '+(taken[i].amount==1?taken[i].X.name:taken[i].X.plural)+'<br>';
				}
				Game.PopNumber(this.l,str);
				this.clicked++;
			}
			var message='';
			if (success && this.winMessage.length>0) message=choose(this.winMessage);
			else if (!success && this.failMessage.length>0) message=choose(this.failMessage);
			else if (this.message.length>0) message=choose(this.message);
			if (message!='')
			{
				for (var i in given)
				{
					//todo : add getamount and beautify
					message=replaceAll('%a'+(parseInt(i)+1),Math.floor(given[i].amount),message);
					message=replaceAll('%r'+(parseInt(i)+1),(given[i].amount==1?given[i].X.name:given[i].X.plural),message);
					message=replaceAll('%s'+(parseInt(i)+1),(given[i].amount==1?'':'s'),message);
				}
				Game.Say(sanitize(message));
			}
			return false;
		}
		this.GainPower=function(what){this.powers.push(what);}
		this.Unlock=function()
		{
			if (this.visible<=0)
			{
				if (Game.sayUnlocks) Game.Say('You unlocked : <b>'+this.name+'</b>.',this.pic);
				this.visible=1;
				Game.toRefresh=1;
			}
		}
		this.Lock=function()
		{
			if (this.visible>0)
			{
				this.visible=0;
				Game.toRefresh=1;
			}
		}
		this.RefreshCosts=function()
		{
		}
		
		Game.clickables[this.key]=this;
		Game.things[this.key]=this;
	}
	
	Game.Building=function(name)
	{
		this.type='building';
		this.id=Game.buildings.length;
		this.key=name;
		this.name=name;
		this.plural=this.name;
		this.description='';
		this.sellable=1;
		this.powers=[];
		this.costs=[];
		this.realCosts=[];
		this.requires=[];
		this.visibleDefault=1;
		this.visible=1;
		this.amount=0;
		this.amountTotal=0;
		this.startsWith=0;
		this.locks=[];
		this.unlocks=[];
		this.unlocksFrom=[];
		this.unlocksAt=[];
		this.represents=[];
		this.occupies=[];
		this.visibleAt=[];
		this.augments=[];
		this.multiplier=1;
		this.multipliedBy=[];
		this.priceIncrease=-1;
		this.sellText='sell 1';
		this.classes=[];
		this.real=1;
		this.pic='';
		
		this.Tooltip=function()
		{
			return '<div style="width:200px;">'+'<div class="name">'+Cap(this.name)+'</div><div class="description">'+this.description+'</div></div>';
		}
		this.GetAmount=function(what)
		{
			var what=(typeof what==='undefined'?this.amount:what);
			return Beautify(what);//Math.floor(what*Math.pow(10,this.digits))/Math.pow(10,this.digits);
		}
		this.RefreshCosts=function()
		{
			for (var i in this.costs)
			{
				this.realCosts[i]={X:this.costs[i].X,amount:(this.costs[i].amount*Math.pow((this.priceIncrease!=-1?this.priceIncrease:Game.priceIncrease),this.amount))};
				if (this.realCosts[i].X.type=='building') this.realCosts[i].amount=Math.ceil(this.realCosts[i].amount);
			}
		}
		this.CanBuy=function()
		{
			var carryOn=1;
			for (var i in this.realCosts){if (this.realCosts[i].X.amount<this.realCosts[i].amount) carryOn=0;}
			for (var i in this.requires){if (this.requires[i].X.amount<this.requires[i].amount) carryOn=0;}
			for (var i in this.occupies){if (this.occupies[i].X.amount<this.occupies[i].amount) carryOn=0;}
			return carryOn;
		}
		this.Buy=function()
		{
			if (this.CanBuy())
			{
				for (var i in this.realCosts){this.realCosts[i].X.amount-=this.realCosts[i].amount;}
				this.amount++;
				this.amountTotal++;
				for (var i in this.powers){this.powers[i]({building:1});}
				for (var i in this.represents)
				{
					this.represents[i].X.amount+=this.represents[i].amount;
					this.represents[i].X.RefreshCosts();
				}
				for (var i in this.occupies)
				{
					this.occupies[i].X.amount-=this.occupies[i].amount;
					this.occupies[i].X.RefreshCosts();
				}
				for (var i in this.unlocks) {this.unlocks[i].Unlock();}
				for (var i in this.locks) {this.locks[i].Lock();}
				this.RefreshCosts();
				Game.toRefresh=1;
			}
			return false;
		}
		this.Sell=function(howmany)
		{
			if (this.amount>0 && this.sellable)
			{
				for (var i in this.realCosts){this.realCosts[i].X.amount+=this.realCosts[i].amount*Game.sellPrice;}
				this.amount--;
				for (var i in this.powers){this.powers[i]({selling:1});}
				for (var i in this.represents)
				{
					this.represents[i].X.amount-=this.represents[i].amount;
					this.represents[i].X.RefreshCosts();
				}
				for (var i in this.occupies)
				{
					this.occupies[i].X.amount+=this.occupies[i].amount;
					this.occupies[i].X.RefreshCosts();
				}
				this.RefreshCosts();
				Game.toRefresh=1;
			}
			return false;
		}
		this.GainPower=function(what){this.powers.push(what);}
		this.Unlock=function()
		{
			if (this.visible<=0)
			{
				if (Game.sayUnlocks) Game.Say('You unlocked : <b>'+this.name+'</b>.',this.pic);
				this.visible=1;
				Game.toRefresh=1;
			}
		}
		this.Lock=function()
		{
			if (this.visible>0)
			{
				this.visible=0;
				Game.toRefresh=1;
			}
		}
		
		Game.buildings[this.key]=this;
		Game.things[this.key]=this;
	}
	
	Game.Upgrade=function(name)
	{
		this.type='upgrade';
		this.visible=1;
		this.bought=0;
		this.id=Game.upgrades.length;
		this.key=name;
		this.name=name;
		this.description='';
		this.powers=[];
		this.costs=[];
		this.requires=[];
		this.visibleDefault=1;
		this.locks=[];
		this.unlocks=[];
		this.unlocksFrom=[];
		this.unlocksAt=[];
		this.visibleAt=[];
		this.converts=[];
		this.augments=[];
		this.classes=[];
		this.real=1;
		this.pic='';
		
		this.Tooltip=function()
		{
			return '<div style="width:200px;">'+'<div class="name">'+Cap(this.name)+'</div><div class="description">'+this.description+'</div></div>';
		}
		this.CanBuy=function()
		{
			var carryOn=1;
			for (var i in this.costs){if (this.costs[i].X.amount<this.costs[i].amount) carryOn=0;}
			for (var i in this.requires){if (this.requires[i].X.amount<this.requires[i].amount) carryOn=0;}
			if (this.bought) carryOn=0;
			return carryOn;
		}
		this.Buy=function()
		{
			if (this.CanBuy())
			{
				for (var i in this.costs){this.costs[i].X.amount-=this.costs[i].amount;}
				this.bought=1;
				for (var i in this.powers){this.powers[i]({building:1});}
				for (var i in this.represents)
				{
					this.represents[i].X.amount+=this.represents[i].amount;
					this.represents[i].X.RefreshCosts();
				}
				for (var i in this.converts)
				{
					if (this.converts[i].X.type=='clickable' || this.converts[i].Y.type=='clickable')
					{
						this.converts[i].X.Lock();
						this.converts[i].Y.Unlock();
						this.converts[i].Y.clicked+=this.converts[i].X.clicked;
						this.converts[i].X.clicked=0;
					}
					else
					{
						this.converts[i].Y.amount+=this.converts[i].X.amount;
						this.converts[i].X.amount=0;
						this.converts[i].Y.amountTotal+=this.converts[i].X.amount;
						this.converts[i].X.amountTotal=0;
						this.converts[i].X.RefreshCosts();
						this.converts[i].Y.RefreshCosts();
						this.converts[i].X.visible=0;
						this.converts[i].Y.visible=1;
					}
				}
				for (var i in this.augments)
				{
					this.augments[i].X.multiplier*=this.augments[i].amount;
				}
				for (var i in this.unlocks) {this.unlocks[i].Unlock();}
				for (var i in this.locks) {this.locks[i].Lock();}
				Game.toRefresh=1;
			}
			return false;
		}
		this.Give=function()
		{
			this.bought=1;
			for (var i in this.powers){this.powers[i]({building:1});}
			for (var i in this.represents)
			{
				this.represents[i].X.amount+=this.represents[i].amount;
				this.represents[i].X.RefreshCosts();
			}
			for (var i in this.converts)
			{
				if (this.converts[i].X.type=='clickable' || this.converts[i].Y.type=='clickable')
				{
					this.converts[i].X.Lock();
					this.converts[i].Y.Unlock();
				}
				else
				{
					this.converts[i].Y.amount+=this.converts[i].X.amount;
					this.converts[i].X.amount=0;
					this.converts[i].Y.amountTotal+=this.converts[i].X.amount;
					this.converts[i].X.amountTotal=0;
					this.converts[i].X.RefreshCosts();
					this.converts[i].Y.RefreshCosts();
				}
			}
			for (var i in this.augments)
			{
				this.augments[i].X.multiplier*=this.augments[i].amount;
			}
			for (var i in this.unlocks) {this.unlocks[i].Unlock();}
			for (var i in this.locks) {this.locks[i].Lock();}
			Game.toRefresh=1;
			return false;
		}
		this.Passive=function()
		{
			for (var i in this.augments)
			{
				this.augments[i].X.multiplier*=this.augments[i].amount;
			}
		}
		this.GainPower=function(what)
		{
			this.powers.push(what);
		}
		this.Unlock=function()
		{
			if (this.visible<=0)
			{
				if (Game.sayUnlocks) Game.Say('You unlocked : <b>'+this.name+'</b>.',this.pic);
				this.bought=0;
				this.visible=1;
				Game.toRefresh=1;
			}
		}
		this.Lock=function()
		{
			if (this.visible>0)
			{
				this.visible=-1;
				this.bought=0;
				for (var i in this.powers){this.powers[i]({selling:1});}
				Game.toRefresh=1;
			}
		}
		this.RefreshCosts=function()
		{
		}
		
		Game.upgrades[this.key]=this;
		Game.things[this.key]=this;
	}
	
	Game.Achievement=function(name)
	{
		this.type='achievement';
		this.id=Game.achievements.length;
		this.key=name;
		this.name=name;
		this.description='';
		this.requires=[];
		this.visibleDefault=0;
		this.visible=0;
		this.won=0;
		this.unlocks=[];
		this.unlocksFrom=[];
		this.unlocksAt=[];
		this.visibleAt=[];
		this.classes=[];
		this.real=1;
		this.pic='';
		
		this.Tooltip=function()
		{
			return '<div style="width:200px;">'+'<div class="name">'+Cap(this.name)+'</div><div class="description">'+this.description+'</div></div>';
		}
		this.Unlock=function()
		{
			if (this.visible<=0 || !this.won)
			{
				if (Game.sayWons) Game.Say('You won : <b>'+this.name+'</b>.',this.pic);
				this.visible=1;
				this.won=1;
				for (var i in this.unlocks) {this.unlocks[i].Unlock();}
				Game.toRefresh=1;
			}
		}
		this.Lock=function()
		{
			if (this.visible>0 || this.won)
			{
				this.visible=0;
				this.won=0;
				Game.toRefresh=1;
			}
		}
		this.RefreshCosts=function()
		{
		}
		
		Game.achievements[this.key]=this;
		Game.things[this.key]=this;
	}
	
	/*=====================================================================================
	SAVE LOAD RESET
	=======================================================================================*/
	
	Game.hasLocalStorage=0;
	try {Game.hasLocalStorage=('localStorage' in window && window['localStorage']!==null);}
	catch (e) {Game.hasLocalStorage=0;}

	Game.Reset=function()
	{
		for (var i in Game.res)
		{
			var me=Game.res[i];
			me.amount=me.startsWith;
			me.amountTotal=me.startsWith;
			me.visible=me.visibleDefault;
			me.multiplier=1;
			me.samples=[0,0,0,0,0];
			me.computedPS=0;
		}
		for (var i in Game.clickables)
		{
			var me=Game.clickables[i];
			me.visible=me.visibleDefault;
			me.clicked=0;
			me.multiplier=1;
		}
		for (var i in Game.buildings)
		{
			var me=Game.buildings[i];
			me.amount=me.startsWith;
			me.amountTotal=me.startsWith;
			me.visible=me.visibleDefault;
			me.RefreshCosts();
			me.multiplier=1;
		}
		for (var i in Game.upgrades)
		{
			var me=Game.upgrades[i];
			me.visible=me.visibleDefault;
			me.bought=0;
		}
		for (var i in Game.achievements)
		{
			var me=Game.achievements[i];
			me.won=0;
			me.visible=me.visibleDefault;
		}
	}
	
	Game.Save=function()
	{
		var str='';
		//I know we should take advantage of localstorage's key system but I'm more comfortable doing it this way
		str+='BEGIN';
		str+='|RESOURCES|';
		for (var i in Game.res)
		{
			var me=Game.res[i];
			str+=me.key+','+me.amount+','+me.visible+','+me.amountTotal+';';
		}
		str+='|CLICKABLES|';
		for (var i in Game.clickables)
		{
			var me=Game.clickables[i];
			str+=me.key+','+me.visible+','+me.clicked+';';
		}
		str+='|BUILDINGS|';
		for (var i in Game.buildings)
		{
			var me=Game.buildings[i];
			str+=me.key+','+me.amount+','+me.visible+','+me.amountTotal+';';
		}
		str+='|UPGRADES|';
		for (var i in Game.upgrades)
		{
			var me=Game.upgrades[i];
			str+=me.key+','+me.visible+','+me.bought+';';
		}
		str+='|ACHIEVEMENTS|';
		for (var i in Game.achievements)
		{
			var me=Game.achievements[i];
			str+=me.key+','+me.won+','+me.visible+';';
		}
		str+='|END';
		str=utf8_to_b64(str);
		localStorage[Game.src]=str;
		//Game.Log('Game saved.');
	}
	
	Game.Load=function()
	{
		Game.Reset();
		
		var str=localStorage[Game.src];
		if (str)
		{
			str=b64_to_utf8(str);
			str=str.split('|');
			var res=[];
			var clickables=[];
			var buildings=[];
			var upgrades=[];
			var achievements=[];
			for (var i in str)
			{
				if (i>0)
				{
					if (str[i-1]=='RESOURCES') res=str[i].split(';');
					else if (str[i-1]=='CLICKABLES') clickables=str[i].split(';');
					else if (str[i-1]=='BUILDINGS') buildings=str[i].split(';');
					else if (str[i-1]=='UPGRADES') upgrades=str[i].split(';');
					else if (str[i-1]=='ACHIEVEMENTS') achievements=str[i].split(';');
				}
			}
			
			for (var i in res)
			{
				res[i]=res[i].split(',');
				var me=Game.res[res[i][0]];
				if (me)
				{
					me.amount=parseFloat(res[i][1]);
					me.visible=parseInt(res[i][2]);
					me.amountTotal=parseFloat(res[i][3]);
				}
			}
			for (var i in clickables)
			{
				clickables[i]=clickables[i].split(',');
				var me=Game.clickables[clickables[i][0]];
				if (me)
				{
					me.visible=parseInt(clickables[i][1]);
					me.clicked=parseInt(clickables[i][2]);
				}
			}
			for (var i in buildings)
			{
				buildings[i]=buildings[i].split(',');
				var me=Game.buildings[buildings[i][0]];
				if (me)
				{
					me.amount=parseFloat(buildings[i][1]);
					me.visible=parseInt(buildings[i][2]);
					me.amountTotal=parseFloat(buildings[i][3]);
					me.RefreshCosts();
				}
			}
			for (var i in upgrades)
			{
				upgrades[i]=upgrades[i].split(',');
				var me=Game.upgrades[upgrades[i][0]];
				if (me)
				{
					me.visible=parseInt(upgrades[i][1]);
					me.bought=parseInt(upgrades[i][2]);
					if (me.bought && me.visible>0) me.Passive();
				}
			}
			for (var i in achievements)
			{
				achievements[i]=achievements[i].split(',');
				var me=Game.achievements[achievements[i][0]];
				if (me)
				{
					me.won=parseInt(achievements[i][1]);
					me.visible=parseInt(achievements[i][2]);
				}
			}
			Game.Log('Save loaded.');
		}
	}
	
	/*=====================================================================================
	PARSER
	=======================================================================================*/
	Game.lines=0;
	Game.failedLines=[];
	
	Game.Power=function(caller,type,thingList,forThingList,requiringThingList,chance,when)//returns a new function that gives/takes/does stuff to things
	{
		return function(params)
		{
			var toReturn={fail:0,gave:[],took:[]};
			if (when=='built' && params.building!=1)
			{toReturn.fail=1;}
			else if (when=='sold' && params.selling!=1)
			{toReturn.fail=1;}
			else if (1 || Math.random()<chance)//chance should only take effect for the "give X Y" part
			{
				if (typeof params==='undefined') params={};
				var mult=(typeof params.mult==='undefined'?1:params.mult);
				if (caller.type=='building' && !when && !params.building && chance==1) mult/=(Game.fps/Game.steps);
				mult*=caller.multiplier;
				if (caller.multipliedBy)
				{
					for (var i in caller.multipliedBy)
					{
						if (!caller.multipliedBy[i].needsUpgrade || (caller.multipliedBy[i].needsUpgrade.visible>0 && caller.multipliedBy[i].needsUpgrade.bought)) mult*=1+(caller.multipliedBy[i].X.amount*caller.multipliedBy[i].amount);
					}
				}
				var carryOn=1;
				
				if (type=='gives' || type=='builds' || type=='grants') type='gives';
				else if (type=='takes' || type=='destroys') type='takes';
				else if (type=='multiplies') type='multiplies';
				
				if (type=='gives' || type=='takes' || type=='multiplies')
				{
					
					var computedForThingList=[];
					for (var i in forThingList)
					{
						if (forThingList[i].X.amount!=='undefined') computedForThingList[i]={X:forThingList[i].X,amount:(Math.random()*(forThingList[i].amount2-forThingList[i].amount1)+forThingList[i].amount1)*mult};
					}
					var computedRequiringThingList=[];
					for (var i in requiringThingList)
					{
						if (typeof requiringThingList[i].X.amount!=='undefined') computedRequiringThingList[i]={X:requiringThingList[i].X,amount:(Math.random()*(requiringThingList[i].amount2-requiringThingList[i].amount1)+requiringThingList[i].amount1)*mult};
					}
					var computedThingList=[];
					for (var i in thingList)
					{
						if (typeof thingList[i].X.amount!=='undefined') computedThingList[i]={X:thingList[i].X,amount:(Math.random()*(thingList[i].amount2-thingList[i].amount1)+thingList[i].amount1)*mult};
					}
					
					for (var i in computedThingList)
					{
						if (type=='takes')
						{if (computedThingList[i].X.amount<computedThingList[i].amount) carryOn=0;}
						else// if (type=='gives')
						{
						}
					}
					for (var i in computedForThingList)
					{
						if (computedForThingList[i].X.amount<computedForThingList[i].amount) carryOn=0;
					}
					for (var i in computedRequiringThingList)
					{
						if (type=='gives')
						{if (computedRequiringThingList[i].X.amount<computedRequiringThingList[i].amount) carryOn=0;}
						else// if (type=='takes')
						{}
					}
					
					if (carryOn)
					{
						for (var i in computedForThingList)
						{
							if (type!='takes')
							{
								computedForThingList[i].X.amount-=computedForThingList[i].amount;
								toReturn.took.push({X:computedForThingList[i].X,amount:computedForThingList[i].amount});
							}
							else
							{
								computedForThingList[i].X.amount+=computedForThingList[i].amount;computedForThingList[i].X.amountTotal+=computedForThingList[i].amount;
								toReturn.gave.push({X:computedForThingList[i].X,amount:computedForThingList[i].amount});
							}
							computedForThingList[i].X.RefreshCosts();
						}
						var winChance=chance;
						if (caller.type=='building') winChance/=Game.fps;
						if (chance==1 || Math.random()<winChance)
						{
							if (chance<1 && computedThingList[i].X.getMessage && computedThingList[i].X.getMessage!='')
							{
								//todo : add getamount and beautify
								var message=choose(computedThingList[i].X.getMessage);
								message=replaceAll('%a',Math.floor(computedThingList[i].amount),message);
								message=replaceAll('%r',(computedThingList[i].amount==1?computedThingList[i].X.name:computedThingList[i].X.plural),message);
								message=replaceAll('%s',(computedThingList[i].amount==1?'':'s'),message);
								Game.Say(sanitize(message));
							}
							//Game.Log('<b>Found :</b> '+Math.floor(computedThingList[i].amount)+' '+computedThingList[i].X.name);
							for (var i in computedThingList)
							{
								if (type=='gives')
								{
									computedThingList[i].X.amount+=computedThingList[i].amount;
									toReturn.gave.push({X:computedThingList[i].X,amount:computedThingList[i].amount});
								}
								else if (type=='takes')
								{
									computedThingList[i].X.amount-=computedThingList[i].amount;
									toReturn.took.push({X:computedThingList[i].X,amount:computedThingList[i].amount});
								}
								else if (type=='multiplies')
								{computedThingList[i].X.amount*=(computedThingList[i].amount/100);}
								computedThingList[i].X.amountTotal=Math.max(computedThingList[i].X.amountTotal,computedThingList[i].X.amount);
								computedThingList[i].X.RefreshCosts();
							}
						}
						else {toReturn.fail=2;}
					}
					else {toReturn.fail=1;}
					
				}
			}
			return toReturn;
		}
		
		//return function(){};
	}
	
	Game.ParseList=function(data)
	{
		var thingList=[];
		var commaList=data.join(' ').split(',');
		for (var i in commaList)
		{
			commaList[i]=commaList[i].split(' ');
			if (commaList[i].length>2) {thingList.push([commaList[i][0],commaList[i][1]]);break;} else thingList.push(commaList[i]);
		}
		return thingList;
	}
	
	Game.ParseLine=function(me,pass)
	{
		var unescapedMe=me;
		me=escapeHtml(me);
		var words=me.split(' ');
		var post=0;//should this line be post-processed ?
		var section=Game.section;
		var subSection=Game.subSection;
		
		if (me.length>1)
		{
			if (beginsWith(me,'//'))//comment
			{
				//~absolutely nothing~
			}
			else//any other command
			{
				var fullMe=me;
				me=me.toLowerCase();
				me=replaceAll(', ',',',me);
				me=replaceAll(': ',':',me);
				me=replaceAll(' :',':',me);
				me=replaceAll(':',' : ',me);
				
				var that='';
				if (section=='resources') that=Game.res[subSection];
				else if (section=='clickables') that=Game.clickables[subSection];
				else if (section=='buildings') that=Game.buildings[subSection];
				else if (section=='upgrades') that=Game.upgrades[subSection];
				else if (section=='achievements') that=Game.achievements[subSection];
				
				if (words[0]=='expanding')
				{//expand existing element in section and subsection
					section=words[1];
					subSection=words[2];
				}
				else if (beginsWith(me,'*'))
				{//start a new item
					me=me.substring(1);
					fullMe=fullMe.substring(1);
					subSection=me;
					if (!new RegExp('^[a-zA-Z0-9]*$').test(subSection)) {Game.Log('Error : "'+(fullMe)+'" is not an appropriate identifier. Alphanumeric characters with no spaces, please.');return 'ERROR';}
					if (Game.FindThing(subSection,1)) {Game.Log('Error : there is already an element with the identifier "'+(fullMe)+'". You cannot have two elements with the same identifier.');return 'ERROR';}
					
					if (section=='resources')
					{
						that=new Game.Res(me);that.name=fullMe;that.plural=fullMe;
						if (Game.hideResources) that.visibleDefault=0;
					}
					else if (section=='clickables')
					{
						that=new Game.Clickable(me);that.name=fullMe;that.plural=fullMe;
						if (Game.hideClickables) that.visibleDefault=0;
					}
					else if (section=='buildings')
					{
						that=new Game.Building(me);that.name=fullMe;that.plural=fullMe;
						if (Game.hideBuildings) that.visibleDefault=0;
					}
					else if (section=='upgrades')
					{
						that=new Game.Upgrade(me);that.name=fullMe;that.plural=fullMe;
						if (Game.hideUpgrades) that.visibleDefault=0;
					}
					else if (section=='achievements')
					{
						that=new Game.Achievement(me);that.name=fullMe;that.plural=fullMe;
						if (Game.hideAchievements) that.visibleDefault=0;
					}
				}
				else if (beginsWith(me,'"'))
				{//start a new description
					unescapedMe=unescapedMe.substring(1).substring(0,unescapedMe.length-2);
					if (that!='') that.description=sanitize(unescapedMe);
				}
				//start a section
				else if (me=='let\'s make a game!') section='main';
				else if (me=='settings : ') section='settings';
				else if (me=='resources : ') section='resources';
				else if (me=='clickables : ') section='clickables';
				else if (me=='buildings : ') section='buildings';
				else if (me=='upgrades : ') section='upgrades';
				else if (me=='achievements : ') section='achievements';
				else if (section=='main')//main (right after the first line)
				{
					if (Game.name=='Unknown') {Game.name=fullMe;}
					else if (beginsWith(me,'by')) {words.shift();Game.madeBy=words.join(' ');}
					else if (beginsWith(me,'created on')) {words.shift();words.shift();Game.createdOn=words.join(' ');}
					else if (beginsWith(me,'last updated on')) {words.shift();words.shift();words.shift();Game.updatedOn=words.join(' ');}
					else if (beginsWith(me,'version')) {words.shift();Game.version=parseFloat(words.join(' '));}
				}
				else if (section=='settings')//settings
				{
					if (beginsWith(me,'prices increase by')) {words.shift();words.shift();words.shift();Game.priceIncrease=parseFloat(words[0])/100;}
					else if (beginsWith(me,'selling gives back')) {words.shift();words.shift();words.shift();Game.sellPrice=parseFloat(words[0])/100;}
					else if (me=='resources are hidden by default') {Game.hideResources=1;}
					else if (me=='clickables are hidden by default') {Game.hideClickables=1;}
					else if (me=='buildings are hidden by default') {Game.hideBuildings=1;}
					else if (me=='upgrades are hidden by default') {Game.hideUpgrades=1;}
					else if (me=='achievements are hidden by default') {Game.hideAchievements=1;}
					else if (me=='resources are visible by default') {Game.hideResources=0;}
					else if (me=='clickables are visible by default') {Game.hideClickables=0;}
					else if (me=='buildings are visible by default') {Game.hideBuildings=0;}
					else if (me=='upgrades are visible by default') {Game.hideUpgrades=0;}
					else if (me=='achievements are visible by default') {Game.hideAchievements=0;}
					//BROKEN FOR NOW
					/*else if (me=='resources go in the') {words.shift();words.shift();words.shift();words.shift();Game.defaultBoxes['resources']=words[0];}
					else if (me=='clickables go in the') {words.shift();words.shift();words.shift();words.shift();Game.defaultBoxes['clickables']=words[0];}
					else if (me=='buildings go in the') {words.shift();words.shift();words.shift();words.shift();Game.defaultBoxes['buildings']=words[0];}
					else if (me=='upgrades go in the') {words.shift();words.shift();words.shift();words.shift();Game.defaultBoxes['upgrades']=words[0];}
					else if (me=='achievements go in the') {words.shift();words.shift();words.shift();words.shift();Game.defaultBoxes['achievements']=words[0];}
					else if (me=='title goes in the') {words.shift();words.shift();words.shift();words.shift();Game.defaultBoxes['title']=words[0];}
					else if (me=='save goes in the') {words.shift();words.shift();words.shift();words.shift();Game.defaultBoxes['save']=words[0];}*/
					else if (me=='hide log') {Game.showLog=0;Game.log.style.display='none';}
					else if (me=='show log') {Game.showLog=1;Game.log.style.display='block';}
					else if (beginsWith(me,'resources are displayed as'))
					{//change resource display string
						words.shift();words.shift();words.shift();words.shift();
						Game.resourceDisplayString=words.join(' ');
					}
					else if (beginsWith(me,'custom stylesheet : '))
					{//get a custom CSS url
						words.shift();words.shift();words.shift();
						Game.css=words.join(' ');
						if (Game.css.indexOf('www.')==-1 && Game.css.indexOf('http://')==-1 && Game.css.indexOf('https://')==-1) Game.css='http://pastebin.com/raw.php?i='+Game.css;
					}
					else if (beginsWith(me,'fonts : '))
					{//get google webfonts
						words.shift();words.shift();
						words=words.join(' ');words=replaceAll(',',' ',words);words=words.split(' ');
						Game.fonts=words;
					}
					else if (beginsWith(me,'background : '))
					{//get background picture
						words.shift();words.shift();
						Game.background=words.join(' ');
					}
					else if (beginsWith(me,'text color : '))
					{//get text color
						words.shift();words.shift();words.shift();
						Game.textColor=words.join(' ');
					}
					else if (beginsWith(me,'boxes : '))
					{//set the divs
						words.shift();words.shift();
						var boxes=words.join(' ');
						boxes=boxes.split(',');
						for (var i in boxes)
						{
							//BROKEN FOR NOW
							//if (!new RegExp('^[a-zA-Z0-9]*$').test(boxes[i])) {Game.Log('Error : "'+(boxes[i])+'" is not an appropriate identifier. Alphanumeric characters with no spaces, please.');return 'ERROR';}
							//else Game.boxes[box]=boxes[i];
						}
						
					}
				}
				else//any other section
				{
					//alert(section+', '+subSection);
					if (that!='')
					{
						if ((section=='resources' || section=='buildings') && (beginsWith(me,'starts at') || beginsWith(me,'starts with') || beginsWith(me,'start at') || beginsWith(me,'start with')))
						{//starting amount
							that.startsWith=parseFloat(words[2]);
						}
						else if (beginsWith(me,'named'))
						{//change display name
							//words.shift();
							//var name=words.join(' ');
							fullMe=fullMe.split(' ');
							fullMe.shift();
							var name=fullMe.join(' ');
							name=name.split('|');
							if (name[1]) that.plural=name[1]; else that.plural=name[0];
							that.name=name[0];
						}
						else if (section=='resources' && beginsWith(me,'displayed as'))
						{//change resource display string
							words.shift();words.shift();
							that.displayString=words.join(' ');
						}
						else if (beginsWith(me,'pic : ') || beginsWith(me,'picture : ') || beginsWith(me,'image : ') || beginsWith(me,'icon : '))
						{//set picture
							fullMe=fullMe.split(' ');
							fullMe.shift();fullMe.shift();
							that.pic=fullMe.join(' ');
						}
						else if (words[0]=='classed')
						{//add CSS classes to this item
							words.shift();
							words=words.join(' ');words=replaceAll(',',' ',words);words=words.split(' ');
							for (var i in words)
							{
								if (new RegExp('^[a-zA-Z0-9]*$').test(words[i])) that.classes.push(words[i]);
							}
						}
						else if (beginsWith(me,'on finding say'))
						{//a message displayed when a resource is earned
							words.shift();words.shift();words.shift();that.getMessage.push(words.join(' '));
						}
						else if (beginsWith(me,'on success say'))
						{//a message displayed on clickable click success (won a chance)
							words.shift();words.shift();words.shift();that.winMessage.push(words.join(' '));
						}
						else if (beginsWith(me,'on failure say'))
						{//a message displayed on clickable click failure (failed a chance)
							words.shift();words.shift();words.shift();that.failMessage.push(words.join(' '));
						}
						else if (words[0]=='says' || words[0]=='say')
						{//a message displayed on clickable click
							words.shift();that.message.push(words.join(' '));
						}
						else if (words[0]=='represents' || words[0]=='represent')
						{//this building grants a passive boost to a resource
							post=1;
							if (pass>0)
							{
								words.shift();
								var thingList=Game.ParseList(words);
								
								for (var i in thingList)
								{
									var thing=Game.FindThing(thingList[i][1]);
									if (thing) that.represents.push({X:thing,amount:parseFloat(thingList[i][0])});
								}
							}
						}
						else if (beginsWith(me,'price increases by') || beginsWith(me,'cost increases by'))
						{//set a price increase for this specific thing
							that.priceIncrease=parseFloat(words[3])/100;
						}
						else if (words[2] && words[0]=='show' && (words[2]=='digit' || words[2]=='digits'))
						{//how many digits after the floating point should we display when writing this thing's amount
							that.digits=parseInt(words[1]);
						}
						else if (me=='hidden')
						{//hide
							that.visibleDefault=0;
						}
						else if (me=='visible')
						{//show
							that.visibleDefault=1;
						}
						else if (me=='abstract')
						{//item is never displayed
							that.real=0;
						}
						else if (beginsWith(me,'visible at'))
						{//item is only visible when we have at least X of Y
							post=1;
							if (pass>0)
							{
								words.shift();words.shift();
								var thingList=Game.ParseList(words);
								
								for (var i in thingList)
								{
									var thing=Game.FindThing(thingList[i][1]);
									if (thing) that.visibleAt.push({X:thing,amount:thingList[i][0]});
								}
							}
						}
						else if (beginsWith(me,'unlocks with') || beginsWith(me,'unlock with'))
						{//item unlocks when X is bought/unlocked
							post=1;
							if (pass>0)
							{
								words.shift();words.shift();
								var thingList=Game.ParseList(words);
								
								for (var i in thingList)
								{
									var thing=Game.FindThing(thingList[i][0]);
									if (thing) thing.unlocks.push(that);
								}
							}
						}
						else if (beginsWith(me,'unlocks at') || beginsWith(me,'unlock at'))
						{//item unlocks when we have at least X of Y
							post=1;
							if (pass>0)
							{
								words.shift();words.shift();
								var thingList=Game.ParseList(words);
								
								for (var i in thingList)
								{
									var thing=Game.FindThing(thingList[i][1]);
									if (thing) that.unlocksAt.push({X:thing,amount:thingList[i][0]});
								}
							}
						}
						else if (words[0]=='unlocks' || words[0]=='unlock')
						{//item unlocks another item when purchased
							post=1;
							if (pass>0)
							{
								words.shift();
								var thingList=Game.ParseList(words);
								
								for (var i in thingList)
								{
									var thing=Game.FindThing(thingList[i][0]);
									if (thing) that.unlocks.push(thing);
								}
							}
						}
						else if (words[0]=='locks' || words[0]=='lock')
						{//item locks another item when purchased
							post=1;
							if (pass>0)
							{
								words.shift();
								var thingList=Game.ParseList(words);
								
								for (var i in thingList)
								{
									var thing=Game.FindThing(thingList[i][0]);
									if (thing) that.locks.push(thing);
								}
							}
						}
						else if (words[0]=='costs' || words[0]=='cost')
						{//item costs an amount of something
							post=1;
							if (pass>0)
							{
								words.shift();
								var thingList=Game.ParseList(words);
								
								for (var i in thingList)
								{
									var bit=thingList[i];
									var X=0;var amount=0;
									X=Game.FindThing(bit[1]);
									if (X)
									{
										amount=parseFloat(bit);
										that.costs.push({X:X,amount:amount});
									}
								}
								
							}
						}
						else if (words[0]=='requires' || words[0]=='require')
						{//item requires an amount of something (but doesn't use it up)
							post=1;
							if (pass>0)
							{
								words.shift();
								var thingList=Game.ParseList(words);
								
								for (var i in thingList)
								{
									var bit=thingList[i];
									var X=0;var amount=0;
									X=Game.FindThing(bit[1]);
									if (X)
									{
										amount=parseFloat(bit);
										that.requires.push({X:X,amount:amount});
									}
								}
								
							}
						}
						else if (section=='buildings' && (words[0]=='occupies' || words[0]=='occupy'))
						{//item takes up an amount of something, and frees it when destroyed
							post=1;
							if (pass>0)
							{
								words.shift();
								var thingList=Game.ParseList(words);
								
								for (var i in thingList)
								{
									var bit=thingList[i];
									var X=0;var amount=0;
									X=Game.FindThing(bit[1]);
									if (X)
									{
										amount=parseFloat(bit);
										that.occupies.push({X:X,amount:amount});
									}
								}
								
							}
						}
						else if (words[3] && (words[0]=='converts' || words[0]=='turns' || words[0]=='convert' || words[0]=='turn') && (words[2]=='to' || words[2]=='into'))
						{
							post=1;
							if (pass>0)
							{
								var X=Game.FindThing(words[1]);
								var Y=Game.FindThing(words[3]);
								if (X && Y) that.converts.push({X:X,Y:Y});
							}
						}
						else if (beginsWith(me,'multiplies income of') || beginsWith(me,'multiplies efficiency of') || beginsWith(me,'multiply income of') || beginsWith(me,'multiply efficiency of'))
						{
							post=1;
							if (pass>0)
							{
								var X=Game.FindThing(words[3]);
								if (words[6]=='per')
								{
									var Y=Game.FindThing(words[7]);
									X.multipliedBy.push({X:Y,needsUpgrade:that,amount:(parseFloat(words[5])/100)});
								}
								else
								{
									that.augments.push({X:X,amount:parseFloat(words[5])/100});
								}
							}
						}
						else if ((words[0]=='gains' || words[0]=='gain') && words[2]=='per')
						{
							post=1;
							if (pass>0)
							{
								var X=Game.FindThing(words[3]);
								that.multipliedBy.push({X:X,amount:(parseFloat(words[1])/100)});
							}
						}
						else if (words[0]=='gives' || words[0]=='takes' || words[0]=='builds' || words[0]=='destroys' || words[0]=='grants' || words[0]=='multiplies' ||
								words[0]=='give' || words[0]=='take' || words[0]=='build' || words[0]=='destroy' || words[0]=='grant' || words[0]=='multiply')
						{//item gives/takes/uses something else
							post=1;
							if (pass>0)
							{
								if (words[0]=='give') words[0]='gives';
								else if (words[0]=='take') words[0]='takes';
								else if (words[0]=='build') words[0]='builds';
								else if (words[0]=='destroy') words[0]='destroys';
								else if (words[0]=='grant') words[0]='grants';
								else if (words[0]=='multiply') words[0]='multiplies';
								var type=words[0];
								words.shift();
								var thingList=[];
								var forThingList=[];
								var requiringThingList=[];
								var chance=1;
								var when='';
								
								//read the list of things this gives/takes
								thingList=Game.ParseList(words);
								
								for (var i in thingList) {words.shift();}
								words.shift();
								
								while (words.length>0)
								{
									//connections
									if (words[0]=='for')
									{
										words.shift();
										
										//read the list of things this gives/takes in return
										forThingList=Game.ParseList(words);
										
										for (var i in forThingList) {words.shift();}
										words.shift();
									}
									else if (words[0]=='requiring')
									{
										words.shift();
										
										//read the list of things this requires
										requiringThingList=Game.ParseList(words);
										
										for (var i in requiringThingList) {words.shift();}
										words.shift();
									}
									else if (words[3] && words[1]=='of' && words[2]=='the' && words[3]=='time')
									{
										chance=parseFloat(words[0])/100;
										words.shift();words.shift();words.shift();words.shift();
									}
									else if (words[1] && words[0]=='when' && (words[1]=='built' || words[1]=='bought'))
									{
										when='built';
										words.shift();words.shift();
									}
									else if (words[1] && words[0]=='when' && (words[1]=='sold' || words[1]=='destroyed'))
									{
										when='sold';
										words.shift();words.shift();
									}
									else words.shift();
								}
								
								
								for (var i in thingList)
								{
									var bit=thingList[i];
									if (type=='multiplies') {var a=bit[0];bit[0]=bit[1];bit[1]=a;}
									var X=0;var amount1=0;var amount2=0;
									X=Game.FindThing(bit[1]);
									if (X)
									{
										bit[0]=bit[0].split('>');
										if (typeof bit[0][1]==='undefined') {amount1=parseFloat(bit[0][0]);amount2=parseFloat(bit[0][0]);} else {amount1=parseFloat(bit[0][0]);amount2=parseFloat(bit[0][1]);}
									}
									thingList[i]={X:X,amount1:amount1,amount2:amount2};
								}
								for (var i in forThingList)
								{
									var bit=forThingList[i];
									var X=0;var amount1=0;var amount2=0;
									X=Game.FindThing(bit[1]);
									if (X)
									{
										bit[0]=bit[0].split('>');
										if (typeof bit[0][1]==='undefined') {amount1=parseFloat(bit[0][0]);amount2=parseFloat(bit[0][0]);} else {amount1=parseFloat(bit[0][0]);amount2=parseFloat(bit[0][1]);}
									}
									forThingList[i]={X:X,amount1:amount1,amount2:amount2};
								}
								for (var i in requiringThingList)
								{
									var bit=requiringThingList[i];
									var X=0;var amount1=0;var amount2=0;
									X=Game.FindThing(bit[1]);
									if (X)
									{
										bit[0]=bit[0].split('>');
										if (typeof bit[0][1]==='undefined') {amount1=parseFloat(bit[0][0]);amount2=parseFloat(bit[0][0]);} else {amount1=parseFloat(bit[0][0]);amount2=parseFloat(bit[0][1]);}
									}
									requiringThingList[i]={X:X,amount1:amount1,amount2:amount2};
								}
								
								that.GainPower(new Game.Power(that,type,thingList,forThingList,requiringThingList,chance,when));
								
								//Game.Log('"'+me+'" has been parsed to "POWER : '+type+' ['+thingList+'] FOR ['+forThingList+'] REQUIRING ['+requiringThingList+'] '+(chance*100)+'% OF THE TIME"');
							}
						}
						else {post=1;me='ERROR';}
					}
				}
			}
		}
		
		Game.section=section;
		Game.subSection=subSection;
		
		if (post && pass==0) return me; else return '';
	}

	Game.ParseData=function(data)
	{
		var originalData=data;
		
		//clean up
		
		//collapse tabs etc into single spaces
		data=replaceAll(String.fromCharCode(13),'[linebreak]',data);
		data=data.replace(/\s+/g,' ');
		data=replaceAll('[linebreak]',String.fromCharCode(13),data);
		data=replaceAll(String.fromCharCode(13)+String.fromCharCode(32),String.fromCharCode(13),data);
		data=replaceAll(String.fromCharCode(13)+String.fromCharCode(45),String.fromCharCode(13),data);
		
		//for (var i=0;i<40;i++){str+=data.charCodeAt(i)+' : '+data.charAt(i)+'<br>';}
		
		//split into lines
		data=data.split(String.fromCharCode(13));
		
		Game.lines=data.length;
		
		Game.section='none';
		Game.subSection='';
		var me='';
		var words=[];
		var i=0;
		var postList=[];//list of links to make between things post-parsing (powers, unlocks, represents...)
		var failedLines=[];//list of lines we couldn't parse
		
		//parse every line
		for (i in data)
		{
			me=Game.ParseLine(data[i],0);
			if (me=='ERROR') failedLines.push('<b>Line '+i+' :</b> '+data[i]);
			else if (me!='')
			{
				postList.push('expanding '+Game.section+' '+Game.subSection);
				postList.push(me);
			}
		}
		
		//apply unlock links
		for (var i in postList)
		{
			Game.ParseLine(postList[i],1);
		}
		
		Game.failedLines=failedLines;
		
		var str='';
		str+='<div style="color:#900;"><b>Failed to parse '+Game.failedLines.length+' lines</b><br>';
		for (var i in Game.failedLines)
		{
			str+=Game.failedLines[i]+'<br>';
		}
		str+='</div>';
		Game.Log(str);
	}

	/*=====================================================================================
	DISPLAY
	=======================================================================================*/
	Game.toRefresh=1;
	
	Game.RefreshResources=function()
	{
		for (var i in Game.res)
		{
			var me=Game.res[i];
			if (me.visible>0) RemoveClass(me.l,'hidden');
			else AddClass(me.l,'hidden');
			if (me.visible>0)
			{
				var str=me.displayString;
				str=replaceAll('%a','<span class="amount resourceAmount">'+me.GetAmount()+'</span>',str);
				str=replaceAll('%r','<span class="name resourceType">'+(me.amount==1?me.name:me.plural)+'</span>',str);
				str=replaceAll('%s',(me.amount==1?'':'s'),str);
				me.l.children[0].innerHTML=str+' ('+Beautify(me.computedPS,1)+'/s)';
				if (me.amount>0) AddClass(me.l,'moreThan0'); else RemoveClass(me.l,'moreThan0');
			}
		}
	}
	Game.RefreshClickables=function()
	{
		for (var i in Game.clickables)
		{
			var me=Game.clickables[i];
			if (me.visible>0) RemoveClass(me.l,'hidden');
			else AddClass(me.l,'hidden');
			if (me.visible>0)
			{
				me.l.children[0].innerHTML=me.name;
				if (me.clicked>0) AddClass(me.l,'moreThan0'); else RemoveClass(me.l,'moreThan0');
			}
		}
	}
	
	Game.RefreshBuildings=function()
	{
		for (var i in Game.buildings)
		{
			var me=Game.buildings[i];
			if (me.visible>0) RemoveClass(me.l,'hidden');
			else AddClass(me.l,'hidden');
			if (me.visible>0)
			{
				var costs='';
				for (var ii in me.realCosts)
				{
					costs+='<div class="costs-'+me.realCosts[ii].X.key+' cost '+(me.realCosts[ii].X.amount<me.realCosts[ii].amount?'disabled':'enabled')+'"><span class="label">costs </span><span class="amount">'+me.realCosts[ii].X.GetAmount(me.realCosts[ii].amount)+'</span> <span class="name">'+(me.realCosts[ii].amount==1?me.realCosts[ii].X.name:me.realCosts[ii].X.plural)+'</div>';
				}
				var requires='';
				for (var ii in me.requires)
				{
					requires+='<div class="requires-'+me.requires[ii].X.key+' requirement '+(me.requires[ii].X.amount<me.requires[ii].amount?'disabled':'enabled')+'"><span class="label">requires </span><span class="amount">'+me.requires[ii].X.GetAmount(me.requires[ii].amount)+'</span> <span class="name">'+(me.requires[ii].amount==1?me.requires[ii].X.name:me.requires[ii].X.plural)+'</div>';
				}
				var occupies='';
				for (var ii in me.occupies)
				{
					occupies+='<div class="occupies-'+me.occupies[ii].X.key+' occupation '+(me.occupies[ii].X.amount<me.occupies[ii].amount?'disabled':'enabled')+'"><span class="label">takes up </span><span class="amount">'+me.occupies[ii].X.GetAmount(me.occupies[ii].amount)+'</span> <span class="name">'+(me.occupies[ii].amount==1?me.occupies[ii].X.name:me.occupies[ii].X.plural)+'</div>';
				}
				if (costs!='') costs='<div class="costs">'+costs+'</div>';
				if (requires!='') requires='<div class="requirements">'+requires+'</div>';
				if (occupies!='') occupies='<div class="occupations">'+occupies+'</div>';
				
				var sellButton='';
				if (me.amount>0 && me.sellable) sellButton='<div class="sell" id="sell-'+me.key+'">'+me.sellText+'</div>';
				
				me.l.children[0].innerHTML='<div class="name buildingType">'+me.name+'</div><div class="amount">'+me.amount+'</div>'+costs+requires+occupies+sellButton;
				
				if (sellButton!='') AddEvent(l('sell-'+me.key),'click',function(me){return function(event){me.Sell(1);if (event) {event.preventDefault();event.stopPropagation();}}}(me));
				
				if (me.amount>0) AddClass(me.l,'moreThan0'); else RemoveClass(me.l,'moreThan0');
				if (!me.CanBuy()) AddClass(me.l,'disabled'); else RemoveClass(me.l,'disabled');
			}
		}
	}
	
	Game.RefreshUpgrades=function()
	{
		for (var i in Game.upgrades)
		{
			var me=Game.upgrades[i];
			if (me.visible>0) RemoveClass(me.l,'hidden');
			else AddClass(me.l,'hidden');
			if (me.visible>0)
			{
				if (me.bought)
				{
					me.l.children[0].innerHTML='<div class="name upgradeType">'+me.name+'</div>';
					AddClass(me.l,'bought');RemoveClass(me.l,'notbought');
				}
				else
				{
					var costs='';
					var requires='';
					for (var ii in me.costs)
					{
						costs+='<div class="costs-'+me.costs[ii].X.key+' cost '+(me.costs[ii].X.amount<me.costs[ii].amount?'disabled':'enabled')+'"><span class="amount resourceAmount">'+me.costs[ii].X.GetAmount(me.costs[ii].amount)+'</span> <span class="name resourceType">'+(me.costs[ii].amount==1?me.costs[ii].X.name:me.costs[ii].X.plural)+'</div>';
					}
					for (var ii in me.requires)
					{
						requires+='<div class="requires-'+me.requires[ii].X.key+' requirement '+(me.requires[ii].X.amount<me.requires[ii].amount?'disabled':'enabled')+'"><span class="amount resourceAmount">'+me.requires[ii].X.GetAmount(me.requires[ii].amount)+'</span> <span class="name resourceType">'+(me.requires[ii].amount==1?me.requires[ii].X.name:me.requires[ii].X.plural)+'</div>';
					}
					if (costs!='') costs='<div class="costs">'+costs+'</div>';
					if (requires!='') requires='<div class="requirements">'+requires+'</div>';
					me.l.children[0].innerHTML='<div class="name upgradeType">'+me.name+'</div>'+costs+requires;
					RemoveClass(me.l,'bought');AddClass(me.l,'notbought');
					if (!me.CanBuy()) AddClass(me.l,'disabled'); else RemoveClass(me.l,'disabled');
				}
			}
		}
	}
	
	Game.RefreshAchievements=function()
	{
		for (var i in Game.achievements)
		{
			var me=Game.achievements[i];
			if (me.visible>0) RemoveClass(me.l,'hidden');
			else AddClass(me.l,'hidden');
			if (me.visible>0)
			{
				if (me.won) {AddClass(me.l,'won');RemoveClass(me.l,'notwon');}
				else {RemoveClass(me.l,'won');AddClass(me.l,'notwon');}
				me.l.children[0].innerHTML=me.name;
			}
		}
	}
	
	Game.CreateDisplay=function()
	{
		//this whole function is kind of a mess
		
		if (Game.background!='')
		{
			if (Game.background.indexOf('www.')==-1 && Game.background.indexOf('http://')==-1 && Game.background.indexOf('https://')==-1) l('body').style.backgroundColor=Game.background;
			else l('body').style.backgroundImage='url('+Game.background+')';
		}
		if (Game.textColor!='') l('body').style.color=Game.textColor;
		
		var things=[Game.res,Game.clickables,Game.buildings,Game.upgrades,Game.achievements];
		var thingsType=['resource','clickable','building','upgrade','achievement'];
		var thingsDiv=['resources','clickables','buildings','upgrades','achievements'];
		var thingsTitle=['Resources','Clickables','Buildings','Upgrades','Achievements'];
		var thingsTypeToDiv={'resource':'resources','clickable':'clickables','building':'buildings','upgrade':'upgrades','achievement':'achievements'};
		
		var str='';
		for (var i in Game.boxes)
		{
			str+='<div id="box-'+Game.boxes[i]+'" class="'+Game.boxes[i]+' block"></div>';
		}
		l('content').innerHTML=str;
		for (var i in Game.defaultBoxes)
		{
			if (l('box-'+Game.defaultBoxes[i]) && thingsTypeToDiv[i]) l('box-'+Game.defaultBoxes[i]).innerHTML+='<div id="'+thingsTypeToDiv[i]+'" class="box"></div>';
		}
		if (!l('box-'+Game.defaultBoxes['support'])) Game.defaultBoxes['support']=Game.boxes[0];
		l('box-'+Game.defaultBoxes['support']).appendChild(l('support'));
		
		var str='';
		str+='<div id="title" class="box"><span class="gameTitle title">'+Game.name+'</span><span class="gameAuthor">'+Game.madeBy+'</span></div>';
		str+='<div id="saveBox" class="box"><div class="button" onclick="Game.Save();">Save</div><div class="button" onclick="Game.Reset();">Reset save</div></div>';
		for (var thing in things)
		{
			for (var i in things[thing])
			{
				var me=things[thing][i];
				var meStr='';
				var meClasses=(me.classes.length>0?(' '+me.classes.join(' ')):'');
				if (!me.real) meClasses+=' abstract';
				if (me.pic=='') meClasses+=' nopic'; else meClasses+=' haspic';
				if (me.type=='resource') meStr='id="resource-'+me.key+'" class="thing resource'+meClasses+' hidden"';
				else if (me.type=='clickable') meStr='id="clickable-'+me.key+'" class="thing button clickable'+meClasses+'  hidden"';
				else if (me.type=='building') meStr='id="building-'+me.key+'" class="thing button building'+meClasses+'  hidden"';
				else if (me.type=='upgrade') meStr='id="upgrade-'+me.key+'" class="thing button upgrade'+meClasses+'  hidden"';
				else if (me.type=='achievement') meStr='id="achievement-'+me.key+'" class="thing button achievement'+meClasses+'  hidden"';
				if (me.Tooltip) meStr+=' '+Game.GetObjTooltip(me);
				if (me.pic=='') meStr='<div '+meStr+'><div></div></div>';
				else
				{
					//if (me.type=='clickable') meStr='<img src="'+me.pic+'" '+meStr+'/>';
					meStr='<div '+meStr+'><div></div><img src="'+me.pic+'"/></div>';
				}
				str+=meStr;
			}
			str+='<div id="'+thingsType[thing]+'Title" class="title">'+thingsTitle[thing]+'</div>';
		}
		l('content').innerHTML+=str;
		
		
		for (var thing in things)
		{
			if (l(thingsTypeToDiv[thingsType[thing]])) l(thingsTypeToDiv[thingsType[thing]]).appendChild(l(thingsType[thing]+'Title'));
			
			for (var i in things[thing])
			{
				var me=things[thing][i];
				me.l=l(thingsType[thing]+'-'+me.key);
				if (me.type=='clickable') AddEvent(me.l,'click',function(me){return function(event){me.Click();if (event) event.preventDefault();}}(me));
				else if (me.type=='building') AddEvent(me.l,'click',function(me){return function(event){me.Buy();if (event) event.preventDefault();}}(me));
				else if (me.type=='upgrade') AddEvent(me.l,'click',function(me){return function(event){me.Buy();if (event) event.preventDefault();}}(me));
				if (me.box) l(me.box).appendChild(me.l);
				else if (l(thingsTypeToDiv[me.type])) l(thingsTypeToDiv[me.type]).appendChild(me.l);
			}
		}
		
		if (l('box-'+Game.defaultBoxes['title'])) l('box-'+Game.defaultBoxes['title']).appendChild(l('title'));
		if (l('box-'+Game.defaultBoxes['save'])) l('box-'+Game.defaultBoxes['save']).appendChild(l('saveBox'));
		
		Game.RefreshResources();
		Game.RefreshClickables();
		Game.RefreshBuildings();
		Game.RefreshUpgrades();
		Game.RefreshAchievements();
	}
	
	/*=====================================================================================
	REGULAR STUFF
	=======================================================================================*/
	
	Game.UnlockStuff=function()
	{
		//unlock things and stuff once per second
		var things=[Game.res,Game.clickables,Game.buildings,Game.upgrades,Game.achievements];
		for (var thing in things)
		{
			for (var i in things[thing])
			{
				var me=things[thing][i];
				if (me.visible!=-1)
				{
					if (me.visible==0)
					{
						var unlock=1;
						for (var ii in me.unlocksAt)
						{
							if (me.unlocksAt[ii].X.amount<me.unlocksAt[ii].amount) unlock=0;
						}
						/*try
						{*/
							if (me.unlocksAt.length>0 && unlock) me.Unlock();
						/*}
						catch(e)
						{
							alert(thing+' , '+me.name+' : '+e.message);
						}*/
					}
					for (var ii in me.visibleAt)
					{
						if (me.visibleAt[ii].X.amount>=me.visibleAt[ii].amount)
						{me.visible=1;}
						else me.visible=0;
						//if (me.type=='clickable') me.Refresh();
					}
					if (me.type=='resource' && me.visibleDefault==0)
					{
						me.visible=(me.amount>0);
					}
				}
			}
		}
	}
	
	/*=====================================================================================
	LOGIC
	=======================================================================================*/
	
	Game.Logic=function()
	{
		if (Game.T%Game.fps==0) Game.UnlockStuff();
		if (Game.T%Game.fps==0) Game.toRefresh=1;
		
		if (Game.T%(Game.fps*30)==0) Game.Save();//auto-save every 30 seconds
		
		if (Game.T%Game.steps==0)
		{
			for (var i in Game.res)
			{
				var me=Game.res[i];
				me.Sample();
				me.computedPS*=Game.fps/Game.steps;
			}
			
			for (var i in Game.buildings)
			{
				var me=Game.buildings[i];
				if (me.amount>0)
				{
					for (var i in me.powers)
					{
						me.powers[i]({mult:me.amount});
					}
				}
			}
			for (var i in Game.upgrades)
			{
				var me=Game.upgrades[i];
				if (me.bought)
				{
					for (var i in me.powers)
					{
						me.powers[i]();
					}
				}
			}
		}
		
		Game.T++;
	}
	
	Game.Draw=function()
	{
		Game.RefreshResources();
		if (Game.toRefresh)
		{
			Game.RefreshClickables();
			Game.RefreshBuildings();
			Game.RefreshUpgrades();
			Game.RefreshAchievements();
			Game.toRefresh=0;
		}
		Game.tooltip.update();
	}
	
	
	/*=====================================================================================
	MAIN LOOP
	=======================================================================================*/
	Game.Loop=function()
	{
		//update game logic !
		Game.catchupLogic=0;
		Game.Logic();
		Game.catchupLogic=1;
		
		//latency compensator
		Game.accumulatedDelay+=((new Date().getTime()-Game.time)-1000/Game.fps);
		Game.accumulatedDelay=Math.min(Game.accumulatedDelay,1000*5);//don't compensate over 5 seconds; if you do, something's probably very wrong
		Game.time=new Date().getTime();
		while (Game.accumulatedDelay>0)
		{
			Game.Logic();
			Game.accumulatedDelay-=1000/Game.fps;//as long as we're detecting latency (slower than target fps), execute logic (this makes drawing slower but makes the logic behave closer to correct target fps)
		}
		Game.catchupLogic=0;
		
		Game.Draw();
		
		setTimeout(Game.Loop,1000/Game.fps);
	}
	
	Game.Launch=function()
	{
		if (Game.lines<2)
		{
			l('javascriptError').innerHTML='<div style="font-size:20px;color:#f00;text-shadow:1px 1px 0px #000;background:rgba(0,0,0,0.75);padding:4px;">'+
			'It appears this game is either empty or not currently accessible.'+
			'<div style="font-size:12px;">This could be temporary and fix itself after a while.<br>This could also be the host of this game\'s source blocking access from this URL. We can\'t really be sure!<br>A proper update for Idle Game Maker is long overdue anyway. Sorry for the inconvenience.</div>'+
			'</div>';
		}
		else
		{
			l('javascriptError').style.display='none';
			
			document.title=Game.name+' by '+Game.madeBy+' | Idle Game Maker';
			
			if (Game.fonts.length>0)
			{
				var fontsElement=document.createElement('link');
				fontsElement.setAttribute('rel','stylesheet');
				fontsElement.setAttribute('type','text/css');
				fontsElement.setAttribute('href','http://fonts.googleapis.com/css?family='+escape(replaceAll(' ','+',Game.fonts.join('|')))+'&subset=latin,latin-ext');
				document.getElementsByTagName('head')[0].appendChild(fontsElement);
			}
			
			Game.Reset();
			Game.Load();
			Game.CreateDisplay();
			Game.Loop();
		}
	}
	
	Game.FetchGame();
	
}



/*=====================================================================================
LAUNCH THIS THING
=======================================================================================*/

window.onload=function()
{
	if (!Game.ready) Game.Init();
	Game.Log('Launching.');
};