/*
 ____  _____ _        _
| __ )| ____| |      / \
|  _ \|  _| | |     / _ \
| |_) | |___| |___ / ___ \
|____/|_____|_____/_/   \_\
http://bela.io
*/
// gui params


let patterns = [0,0,0,0,0,0,0,0,0,0,0]; //array to be sent to Bela
var strokeWidth = 4;
var strokeColor = '#00ddff';
var fillColor = [180, 255, 255];
var drawStroke = true;
var	drawFill = true;
let buttonState = 0; //PLAY/STOP button
let beats = 0; //Current beat being played (8 beats, from 0 to 7)
let blueled = "glowing-blue";
let whiteled = "glowing-white";
let yellowled = "glowing-yellow";
let redled = "glowing-yellow";
let greenled = "glowing-yellow" ;
let offled = "glowing-yellow";
let		nStartAngle= -193;
let		nEndAngle= 71;
var led=[];
let xy="";
var buttonx=[];
var buttony=[];
var knobx=[];
var knoby=[];
var knobVal=[0,0,0,0,0,0,0,0];
var oldKnobVal=[0,0,0,0,0,0,0,0];
var newKnobVal=[0,0,0,0,0,0,0,0];
var current='guitest';
var mouseOver=-1;
var knobOver=-1;
var bs=[];
var lastd=0;
let  hSlider = 0;
let  saSlider = 0;
let  sbSlider = 0;
let baSlider = 0;
let  bbSlider =0;
// setup socket
var _socket = io('/IDE');
// sub- minimal wrapper for socket.io to inject clientId
// NOTE: you can probably skip this and just use the plain `io()` object.
function loadImg(){
	knob="LittlePhatty.png";  
	tsr=loadImage("tsre1.png");
 //knob=" Moogish.png";
	img = loadImage(knob);
	but = loadImage("xp_button.png"); 
	meter = loadImage("led_meter.png");

}
var socket = {
    on: (what, cb) => _socket.on(what, cb),
    io: _socket.io,
    emit: (what, data) => {
        socket.id = _socket.id;
        if("object" === typeof(data) && !Array.isArray(data))
            data.clientId = socket.id;
        _socket.emit(what, data);
    },
}
function require(script) {
    $.ajax({
        url: script,
        dataType: "script",
        async: false,           // <-- This is the key
        success: function () {
            // all good...
        },
        error: function () {
            throw new Error("Could not load script " + script);
        }
    });
}
function mousePressed() {

	      mouseOver = -1;

   for(i=0;i<8;i++)
   {
	   	if(i<4)
	   	{
		   	d=dist(buttonx[i], buttony[i], mouseX, mouseY) ;
		   	if (d< 30) {
			     mouseOver = i;
			     bs[mouseOver]=1;
			     break;
		    } else {
			      bs[i]=0;
		    }
	   	}

		   	d=dist(knobx[i],knoby[i], mouseX, mouseY) ;
		   	if (d< 40) {
			     knobOver = i;
			     break;
		    } else {
			      bs[i]=0;
		    }
	   		

   }
   if(mouseOver===0)
   {
   	Bela.control.send({but1:1});
   }
      if(mouseOver===1)
   {
   	Bela.control.send({but2:1});
   }
      if(mouseOver===2)
   {
   	Bela.control.send({but3:1});
   }
      if(mouseOver===3)
   {
   	Bela.control.send({but4:1});
   }
}
function mouseReleased() {
//   spk.inactive();
	knobOver=-1;
   if(mouseOver===0)
   {
   	Bela.control.send({but1:0});
   }
      if(mouseOver===1)
   {
   	Bela.control.send({but2:0});
   }
      if(mouseOver===2)
   {
   	Bela.control.send({but3:0});
   }
      if(mouseOver===3)
   {
   	Bela.control.send({but4:0});
   }
bs[mouseOver]=0;
mouseOver = -1;

}
function showControls(){
	for(i=0;i<10;i++)
	{
		stroke('#404040');

		dv=Math.trunc(dig[i]*500);
		if(dv>10)
		dv=10;
		colorMode(HSB,360,100,100);
		h=42;
		sa=68;
		sb=36;
		b=52;
		fill(h,dv*sa+sb,b+dv*5);
		colorMode(RGB, 255, 255, 255);
		rect(210+15*i,40,15,30);
		fill('#d4af37');
		if(i<8)
		{
			text(i+'', px, 70+i*70);
			text(i+'', 555, 70+i*70);
			val=Math.trunc(36*adc[i]);
		    image(meter, 10, 80+i*70,128,32,0,val*32,128,32); 
			val=Math.trunc(36*dac[i]);
		    image(meter, 460, 80+i*70,128,32,0,val*32,128,32); 
		}
		else
		{
			val=Math.trunc(36*audio[i-8]/100);
		    image(meter, 110, i*90-110,128,32,0,val*32,128,32); 
		    image(meter, 350, i*90-110,128,32,0,val*32,128,32); 
			
		}
		image(tsr,50,50+i*70);
		image(tsr,500,50+i*70);
	}
			stroke('#f0f0f0');
		strokeWeight(2);
		line(210+150-2,40,210+150-2,70-2);
		stroke('#c0c0c0');
		line(210,70-1,210+150-2,70-1);
		stroke(0);
		line(210,40-3,210+150-2,40-3);
		strokeWeight(1);

}
function showKnobs(){
	for(i=0;i<4;i++)
    {
    	val=button[i];
    	if(mouseOver==i)
		   	val=1;
		image(but, 150+i*80, 640,60,60,0,val*60,60,60); 
		buttonx[i]=150+i*80+30;
		buttony[i]=640+30;
		textSize(20);
		fill('#d4af37');
		text(i+'',buttonx[i],buttony[i]+5);
		fill('#000000');
		text(i+'',buttonx[i]+2,buttony[i]+5+2);
    }

	for(i=0;i<8;i++)
	{
	   	let val =Math.trunc((adc[i])*100);
	   	val=knobVal[i];
//		dm = document.getElementById('#'+i*1000);
//		dm.textContent=(val+'');
//	spk.update();
		posx=350;
		if(i%2===0)
			posx=150;
		posy=100+Math.trunc(i/2)*140;
		image(img, posx, posy,80,80,0,val*80,80,80); 
		knobx[i]=posx+30;
		knoby[i]=posy+30;
		textSize(20);
		fill('#d4af37');
		text(labels[i],posx+40,posy-10);
	}
}


// run the project: call this function in response to clicking on the dropdown
function runProject(projectName) {
    socket.emit('process-event', {
        event: 'run',
        currentProject: projectName
    });
}
function mySelectEvent() {
  let item = sel.value();
 runProject(item);
}

function sendKnobVal(k) {
		if(k===0)
		{
			Bela.control.send({knob1:knobVal[k]/100.0});
		}
		if(k===1)
		{
			Bela.control.send({knob2:knobVal[k]/100.0});
		}
		if(k===2)
		{
			   	Bela.control.send({knob3:knobVal[k]/100.0});
		}
		if(k===3)
		{
			   	Bela.control.send({knob4:knobVal[k]/100.0});
		}
		if(k===4)
		{
			   	Bela.control.send({knob5:knobVal[k]/100.0});
		}
		if(k===5)
		{
			   	Bela.control.send({knob6:knobVal[k]/100.0});
		}
		if(k===6)
		{
			   	Bela.control.send({knob7:knobVal[k]/100.0});
		}
		if(k===7)
		{
			   	Bela.control.send({knob8:knobVal[k]/100.0});
		}

}
function getData(){
     adc = Bela.data.buffers[0];
     dac = Bela.data.buffers[1];

     audio = Bela.data.buffers[2];
     dig = Bela.data.buffers[3];   
     button = Bela.data.buffers[4];
     for(i=0;i<8;i++)
     {
     	if(Math.abs(oldKnobVal[i]-adc[i])>0.01)
     	{
     		newKnobVal[i]=Math.trunc(adc[i]*100);
     		oldKnobVal[i]=adc[i];
     	}
     	delta=Math.sign(newKnobVal[i]-knobVal[i]);
		knobVal[i]+=delta;
      	sendKnobVal(i);
    }
}
function drawPanel(){
	if(knobOver>-1)
	{
		d=-mouseY+knoby[knobOver];
		if(d>lastd&&knobVal[knobOver]<100)
		{
			knobVal[knobOver]++;
		}
		if(d<lastd&&knobVal[knobOver]>0)
		{
			knobVal[knobOver]--;
		}
		lastd=d;
		newKnobVal[knobOver]=	knobVal[knobOver];
	sendKnobVal(knobOver);

	}
	Bela.control.send({ggui:0});
	background("#000040");
	stroke('#000000');
	fill('#d4af37');
	rect(20,600,100,140,20);
	rect(470,600,100,140,20);
	textSize(30);
	fill(0, 0, 0);
	px=35;
	textAlign(CENTER);
	text('L', px, 640);
	text('+', px, 670);
	text('R', px, 710);
	text('L', 95+450, 640);
	text('+', 95+450, 670);
	text('R', 95+450, 710);
	textSize(20);
	fill('#d4af37');
	text("IN",62.5,25);
	text("OUT",525,25);
	textAlign(CENTER);
	text("PEPPER",280,25);
}
var _digital=function(title,posx,posy,id){
	mon=createDiv();
	mon.class("monframe");
	mon.position(posx,posy);
	sp=createSpan(title);
	sp.class("titlex");
	di=createDiv();
	di.id("#"+id);
	di.class("monitor-digital");
	mon.child(sp);
	mon.child(di);
	return mon;
//	<div draggable="false" class="monframe" style="position: absolute; left: 1062px; top: 365px;" id="82"><span class="titlex">CV 1</span><div class="monitor-digital">0.00</div></div>
// <div class="monframe"><span class="titlex">Speed</span><div id="1234" class="monitor-digital"></div></div>
	
}
var _glow=function(color){
if(color==="blue")
return  blueled;
if(color==="white")
return whiteled;
else
 return yellowled;
}
var _flash=function(id,color){
	 paragraph = document.getElementById(id);
	 if(paragraph!==null)
	 {
		 paragraph.className="monitor-boolean "+color;
		 x=id+100;
	     paragraph = document.getElementById(x.toString());
	 if(paragraph!==null)
	     paragraph.className=_glow(color);
	 }
}
var _createled=function(id,color,posx,posy){
		mb=createDiv();
		mb.class("monitor-boolean "+color);
		mb.position(posx,posy);
		mb.id(id);
		na=createDiv();
		na.class("notification active");
		met=createDiv();
		met.class("metal");
		li=createDiv();
		li.class("light");
		gli=createDiv();
		gli.class("glowing");
		gl=createDiv();
		gl.class(_glow(color));
		gl.id(id+100);
		gli.child(gl);
		li.child(gli);
		met.child(li);
		na.child(met);
		mb.child(na);

		return(mb);
}
var _rotate = function (eImage, sValue, nMin, nMax){

		var nValue = window.parseFloat(sValue);
		var nRotationAngle = ((nEndAngle - nStartAngle)/(nMax - nMin))*nValue + (nStartAngle - ((nEndAngle -nStartAngle)/(nMax - nMin))*nMin) ;
		eImage.style.webkitTransform="rotate("+nRotationAngle+"deg)"; //chrome and safari
		eImage.style.MozTransform="rotate("+nRotationAngle+"deg)"; //firefox
		eImage.style.msTransform="rotate("+nRotationAngle+"deg)"; //ie
		eImage.style.OTransform="rotate("+nRotationAngle+"deg)"; //opera
	};
	
var _createDial=function (nMin,nMax,posx,posy,id){
		dial1=createDiv();
		dial1.class("monitor");
		dial1.position(posx,posy);
		dial1.id(id);
		dial=createDiv();
		dial.class("monitor-analog");
		let needle = createImg(  'img/indicator-needle.png',  'needle');
		needle.position(22, 22);
		needle.class(needle);
		needle.style("transform: rotate(-67.7031deg);");
		dial.child(needle);

			for (var i = 0; i < 9; i++) { //each number indicator
				var eNumber=createSpan();
				eNumber.class("number pos"+i);
				var sText = nMin + i*((nMax - nMin)/8);
				sText += ''; //convert to string
				if (sText.length > 5){
					var sText2 = '' + (parseFloat(sText).toExponential(1));
					if (sText2.length < sText.length){
						sText = sText2;
					}
				}
	//			_rotate(eNeedle, oElement.value, oElement.nMin, oElement.nMax);
				eNumber.html(sText) ;
				dial.child(eNumber);
			}

	dial1.child(dial);
//			eValue = $('#'+'98'+' .monitor-analog img')[0];
//			eDiv = $('div#'+'98')[0];
//			_rotate(eValue,rSlider.value(), 0, 256);
	return dial1;
	}
socket.on('init', (data) => {
   console.log(data.projects);  // this is the list of projects that you can use to fill in a dropdown
       for(var i=0;i<data.projects.length;i++)
    {
    	if(data.projects[i]!=="undefined")
    	  sel.option(data.projects[i]);
    }
    current=data.settings.project;
    sel.selected(current);
})
socket.on('project-list', (project, list)=>  {
    // `project` (if defined) would be the current or new project. Ignore that
    console.log(list); // this is list.length;i++)
    /*
     for(var i=0;i<list.length;i++)
    {
   	if(list[i]!=="undefined")
    	  sel.option(i+list[i]);
    }
    */
//    if(project!==0)
//	   sel.selected(project);
}	)	
function displayPanel(){
    getData();
	drawPanel();
	showControls();
	showKnobs();

}
