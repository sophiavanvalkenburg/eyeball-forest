var IMGPATH = 'img/';
var CANVAS_HEIGHT = window.innerHeight;
var CANVAS_WIDTH = window.innerWidth;
var NUM_EYEBALLS = 5;
var NUM_PUPILS = 4;
var GROUND_COLOR = [253, 125, 152];
var FOG_START_COLOR = [255, 255, 255, 200];
var FOG_END_COLOR = [255, 255, 255, 0];

var SETTINGS = {
    'maxHeight':        CANVAS_HEIGHT,
    'maxWidth':         CANVAS_WIDTH,
    'heightInterval':   20,
    'heightFactor':     1.5,
    'heightOffset':     5,
    'widthInterval':    20,
    'widthFactor':      1.6,
    'widthOffset':      5,
    'scaleValue':       0.025,
    'scaleFactor':      1.6
};

var drawCanvas;

var eyeballs = [];
var eyeballPool = eyeballs;
var pupils = [];

var eyeballInstances = [];
var pupilInstances = [];
var fogLines = [];

function loadEyeballs(){
    var imgNums = ['01', '02', '03', '04', '05'];
    for (var i = 0; i < imgNums.length; i++){
        var n = imgNums[i];
        var eyeballImg = loadImage(IMGPATH + 'eye' + n + '.png');
        var eyeballMask = loadImage(IMGPATH + 'eye' + n + 'mask.png');
        eyeballs.push({
            'id': i,
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
    var loopCount = 0;
    var height = horizon;
    while (height < SETTINGS.maxHeight){

        var width = random(-20, 20);
        // don't draw the first row because you can't see it through fog anyway
        while (loopCount != 0 && width < SETTINGS.maxWidth){   
            var x = width + random(-SETTINGS.widthOffset, SETTINGS.widthOffset);
            var y = height + random(-SETTINGS.heightOffset); 
            drawEyeball(x, y, SETTINGS.scaleValue);
            width += SETTINGS.widthInterval;
        }

        height += SETTINGS.heightInterval;
        heightInterval *= SETTINGS.heightFactor;
        heightOffset *= SETTINGS.heightFactor;
        widthInterval *= SETTINGS.widthFactor;
        widthOffset *= SETTINGS.widthFactor;
        scaleValue *= SETTINGS.scaleFactor;

        loopCount++;
    }
}

function getRandomEyeball(){
    // ensure we choose a different eyeball each time
    var eyeball = random(eyeballPool);
    eyeballPool = eyeballs.slice();
    eyeballPool.splice(eyeball.id, 1);
    return eyeball;
}

function drawEyeball(x, y, scaleValue){
    var eyeball = getRandomEyeball();
    var width = eyeball.img.width * scaleValue;
    var height = eyeball.img.height * scaleValue;
    var y = y - height;
    image(eyeball.img, x, y, width, height);
    eyeballInstances.push({
        'id': eyeball.id,
        'x': x,
        'y': y,
        'width': width,
        'height': height,
        'scale': scaleValue
    });
}

function getPupilYOffset(height, eId){
    switch(eId){
        case 0: return height / 20;
        case 1: return height / 18;
        case 2: return height / 30;
        case 3: return height / 15;
        case 4: return 0;
    }
}

function getPupilXOffset(width, eId){
    switch(eId){
        case 2: return 3 * width / 8;
        default: return width / 2;
    }
}

function getPupilScale(eId) {
    switch(eId){
        case 2: return 0.35;
        default: return 0.75;
    }
}

function drawPupils(){
    var pupil = random(pupils);
    var pupilYOffset = getPupilYOffset(height, eyeball.id);
    var pupilXOffset = getPupilXOffset(width, eyeball.id)
    var pupilScale = getPupilScale(eyeball.id);
    image(pupil, x + pupilXOffset, y + pupilYOffset, pupilScale * pupil.width * scaleValue, pupilScale * pupil.height * scaleValue);

}

function drawFog(){
     // don't fog the ones in the front
     if (height < maxHeight) {
        drawBackground(fogStart, height, color(FOG_START_COLOR), color(FOG_END_COLOR));
    }
}

function preload(){
    
    loadEyeballs();
    loadPupils();   

}


function setup(){

    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    drawCanvas = createGraphics(CANVAS_WIDTH, CANVAS_HEIGHT);

    var horizon = CANVAS_HEIGHT / 3 + 30;
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

function draw() {
    image(drawCanvas, 0, 0);
    drawPupils();
}
