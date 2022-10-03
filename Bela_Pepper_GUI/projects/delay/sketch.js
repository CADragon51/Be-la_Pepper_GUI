var sel;
var labels=["Speed","Time","HF","Feedback","FX Send","Wet/Dry","6","7"];

function setup() {

	cnv=createCanvas(600, 780);
	loadImg();
	sel = createSelect();
    sel.position(10, 10);
    sel.changed(mySelectEvent);
    sel.selected('guitest');
}


function draw() {
	Bela.data.sendBuffer(0, 'float', [0, 0,0,0,0,0,0,0]);
	displayPanel();
}

