
var imgpix=[];
var pix=[];
var breite=4;
var img;
var power=1.0;
var cx=0,cy=0;
var xOffset, yOffset, cxoff, cyoff;
var locked=true;
var maketrans=false;

function setup()
{
  var c=createCanvas(500,300);
  c.position(300, 50);
  c.drop(gotFile);
  pixelDensity(1);
  frameRate(100);
  for (j = 0; j < 4*width*height; j++)
       imgpix[j]=pix[j]=100;
  drawpix();     
  text=createDiv('Abbbildung: (z+'+cx +'+i'+cy+')^1/2');
  text.position(20, 130);
  saveButton = createButton('Bild speichern');
  saveButton.position(20, 200);
  saveButton.mousePressed(Save);
  transformButton = createButton('Wiederholen');
  transformButton.position(20, 100);
  transformButton.mousePressed(wiederhole);
  
}

function Save(){
save('julia.jpg');
	}

function wiederhole(){
	for (j = 0; j < 4*width*height; j++)
       imgpix[j]=pix[j];
    power=1;   
    maketrans=true;
}
function gotFile(file){

     img = createImg(file.data);
     img.hide();
     image(img,0,0,width,height);
     loadPixels();
     for (j = 0; j < 4*width*height; j++)
       imgpix[j]=pix[j]=pixels[j];
     maxiter=1;
     iterations=0;

}

function draw()
{
  if(maketrans){
	  if(power <= 2){
        power +=0.05;
        abbildung(cx,cy,power);
      } else{
	    maketrans=false;
	  }
  }
  drawpix();
  
}


function mousePressed() {
  if (0 < mouseX && mouseX < width && 0 < mouseY && mouseY <height) {
    xOffset = mouseX;
    yOffset = mouseY;
    cxoff=cx;
    cyoff=cy;
    locked=true;
  }
}

function mouseDragged() {
  if (locked) {
    cx = cxoff + (mouseX-xOffset)*breite/width;
    cy = cyoff - (mouseY-yOffset)*breite/width;
    power=1;
    text.remove();
    text=createDiv('Abbbildung: (z+'+cx +'+i'+cy+')^1/2');
    text.position(20, 130);
    abbildung(cx,cy,power);
  }
}

function mouseReleased() {
  if (locked) {	  
    locked=false;
    maketrans=true;
  }
}

function reset() {
   for (j = 0; j < 4*width*height; j++)
    pix[j]=imgpix[j];
}

function drawpix() {
loadPixels();
	for (j = 0; j < width*height; j++) {
        for(l=0;l<4;l++)
            pixels[4*j+l]=pix[4*j+l];
		}
updatePixels();
}

function abbildung(tx,ty,pot) {
  var j, hpix=[],l;
  for (j = 0; j < 4*width*height; j++)
    hpix[j]=imgpix[j];
  for (j = 0; j < width*height; j++) {
        for(l=0;l<4;l++)
            pix[4*j+l]=hpix[4*transform(j, -tx, -ty,pot)+l];

  }

}

function transform(j, tx, ty,pot) {
  var xh=(j%width*1.0/width-0.5)*breite;
  var yh=(0.5*height-j/width)*breite/width;
    
    if(pot==2){
	  var xhh=xh;	
	  xh=xh*xh-yh*yh+tx;
	  yh=2*xhh*yh+ty;
	} else if(pot==1){
	  xh+=tx;
	  yh+=ty;
	} else{	
      var r=sqrt(xh*xh+yh*yh);
      var phi=acos(xh/r);
      if(yh<0)
        phi=2*PI-phi;
      var absz=pow(r,pot);
	  xh=absz*cos(pot*phi)+tx;
	  yh=absz*sin(pot*phi)+ty;
    }

  var x=floor(width*(xh/breite+0.5));
  var y=floor(height*0.5-width*yh/breite);

  if (0 <= x && x < width && 0 <= y && y < height)
    return width*y+x;
  else
    return 0;
}
