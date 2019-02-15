var horizontal = [];
var vertical = [];
var shapes = [];
var center_dist = 70;   // c_d / d_r > 2 (maintain this ratio for well defined shapes)
var def_radius = 30;

function setup() {
	createCanvas(550,550);	
    ellipseMode(RADIUS);
    angleMode(DEGREES);
    for(i = 150; i < width - def_radius; i+=center_dist) {
	   horizontal.push(new node(i, 60, Math.floor(random(0,360))));    //horizontal generators
    }

    for(i = 150; i < height - def_radius; i+=center_dist) {
        vertical.push(new node(60, i, Math.floor(random(0,360))));    //vertical generators
    }
   
    //make the 'shape' array
    for(var i=0; i<vertical.length; i++) {
        shapes[i] = new Array();
        for(var j=0; j<horizontal.length; j++) {
            shapes[i][j] = new history_();
        }
    }
}

function draw() {
	background(0);
    for(var circle of horizontal) {
        circle.show();
        circle.update(true);
    }

    for(var circle of vertical) {
        circle.show();
        circle.update(false);
    }
    Shapes();
    trace(shapes);
    document.getElementById('fr').innerHTML = Math.floor(frameRate());
}

function Shapes() {
    for(var i=0; i<vertical.length; i++) {
        for(var j=0; j<horizontal.length; j++)
            shapes[i][j].add(horizontal[j].x+horizontal[j].xo,vertical[i].y+vertical[i].yo);
    }
}

function trace (shapes) {
    strokeWeight(1);
    stroke(255);
    var head;
    for(var i=0; i<vertical.length; i++) {
        for(var j=0; j<horizontal.length; j++) {
            noFill();
            beginShape();
            for (var pt of shapes[i][j].path) {
                vertex(pt.x, pt.y);
                head = createVector(pt.x, pt.y);
            }
            endShape();
            fill(255);
            ellipse(head.x, head.y, 2);
        }
    } 
}

class node {
	constructor(x,y,phase, size = def_radius) {
		this.xo = x;
		this.yo = y;
		this.phase = phase;
		this.speed = random(5,10);
        this.probability = random(0,1);
        this.rad = size;
		this.x;
		this.y;
	}

    show() {
        stroke(255);
        noFill();
        strokeWeight(.6);
        ellipse(this.xo, this.yo, this.rad);
    }
    update(mode) {
        this.x = this.rad * cos(this.phase);
        this.y = this.rad * sin(this.phase);
        stroke(255,255,0);
        line(this.xo, this.yo, this.x+this.xo, this.y+this.yo);
        fill(255,255,0,100);
        ellipse(this.x+this.xo, this.y+this.yo, 2);
        if(this.probability > 0.5)
            this.phase += this.speed;
        else
            this.phase -= this.speed;
        this.phase %= 360;
        if(mode) {
            line(this.x+this.xo, this.y+this.yo, this.x+this.xo, height);
        }
        else {
            line(this.x+this.xo, this.y+this.yo, width, this.y+this.yo);
        }
    }
}

class history_ {
    constructor() {
        this.path = [];
    }
    add(x,y) {
        this.path.push(createVector(x,y));
        if(this.path.length > 250)
            // this.path.splice(0,this.path.length-1);
            this.path.splice(0,1);
    }
}