var IMGPATH = 'img/';
var CANVAS_HEIGHT = window.innerHeight;
var CANVAS_WIDTH = window.innerWidth;
var NUM_EYEBALLS = 5;
var NUM_PUPILS = 4;
var GROUND_COLOR = [253, 110, 139];
var FOG_START_COLOR = [255, 255, 255, 200];
var FOG_END_COLOR = [255, 255, 255, 0];

var eyeballs = [];
var eyeballPool = eyeballs;
var pupils = [];

function loadEyeballs(){
    var imgNums = ['01', '02', '03', '04', '05'];
    for (var i = 0; i < imgNums.length; i++){
        var n = imgNums[i];
        var eyeballImg = loadImage(IMGPATH + 'eye' + n + '.png');
        var eyeballMask = loadImage(IMGPATH + 'eye' + n + 'mask.png');
        eyeballs.push({
            'img': eyeballImg,
            'mask': eyeballMask
        });
    }
}

function loadPupils(){
    var imgNums = ['01', '02', '03', '04'];
    for (var i = 0; i < imgNums.length; i++){
        pupils.push(loadImage(IMGPATH + 'pupil' + imgNums[i] + '.png'));
    }
}

function drawBackground(heightStart, heightEnd, colorStart, colorEnd) {
    noFill();
    for (var i = heightStart; i <= heightEnd; i++) {
        var inter = map(i, heightStart, heightEnd, 0, 2);
        var c = lerpColor(colorStart, colorEnd, inter);
        stroke(c);
        line(0, i, CANVAS_WIDTH, i);
    }
}

function drawEyeballs(horizon, fogStart) {
    var maxHeight = CANVAS_HEIGHT;
    var maxWidth = CANVAS_WIDTH;
    var heightInterval = 20;
    var heightFactor = 1.5;
    var widthInterval = 20;
    var widthFactor = 1.6;
    var heightOffset = 5
    var widthOffset = 5;
    var scaleValue = 0.025
    var scaleFactor = 1.6;
    var height = horizon;
    var loopCount = 0;
    while (height < maxHeight){

        var width = random(-20, 2);
        while (loopCount != 0 && width < maxWidth){   
            var x = width + random(-widthOffset, widthOffset);
            var y = height + random(-heightOffset); 
            drawEyeball(x, y, scaleValue);
            width += widthInterval;
        }

        var oldHeight = height;
        height += heightInterval;
        heightInterval *= heightFactor;
        heightOffset *= heightFactor;
        widthInterval *= widthFactor;
        widthOffset *= widthFactor;
        scaleValue *= scaleFactor;

        // don't fog the ones in the front
        if (height < maxHeight) {
            drawBackground(fogStart, height, color(FOG_START_COLOR), color(FOG_END_COLOR));
        }
        loopCount++;
    }
}

function getRandomEyeball(){
    // ensure we choose a different eyeball each time
    var eyeball = random(eyeballPool);
    eyeballPool = eyeballs.slice();
    eyeballPool.splice(eyeballPool.indexOf(eyeball), 1);
    return eyeball;
}

function drawEyeball(x, y, scaleValue){
    var eyeball = getRandomEyeball();
    var width = eyeball.img.width * scaleValue;
    var height = eyeball.img.height * scaleValue;
    y = y - height;
    image(eyeball.img, x, y, width, height);
}

function preload(){
    
    loadEyeballs();
    loadPupils();   

}


function setup(){

    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    var horizon = CANVAS_HEIGHT / 3;
    var fogStart = horizon - 40;

    background(color(GROUND_COLOR));

    noStroke();
    var topColor = color(FOG_START_COLOR);
    topColor.setAlpha(255);
    fill(topColor);
    rect(0, 0, CANVAS_WIDTH, fogStart + 1);
    noFill();
    
    drawEyeballs(horizon, fogStart);     
    
}
