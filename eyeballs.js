var IMGPATH = 'img/';
var CANVAS_HEIGHT = window.innerHeight;
var CANVAS_WIDTH = window.innerWidth;
var NUM_EYEBALLS = 5;
var NUM_PUPILS = 4;

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

function drawBackground(horizon) {
    noFill();
    var y = horizon; 
    var w = CANVAS_WIDTH;
    var h = CANVAS_HEIGHT;
    var c1 = color(255);
    var c2 = color(253, 63, 102);
    for (var i = y; i <= h; i++) {
        var inter = map(i, y, h, 0, 2);
        var c = lerpColor(c1, c2, inter);
        stroke(c);
        line(0, i, w, i);
    }
}

function drawEyeballs(horizon) {
    var maxHeight = CANVAS_HEIGHT;
    var maxWidth = CANVAS_WIDTH;
    var heightInterval = 20;
    var heightFactor = 1.5;
    var widthInterval = 20;
    var widthFactor = 1.6;
    var heightOffset = 5
    var widthOffset = 5;
    var scaleValue = 0.025;
    var scaleFactor = 1.6;
    var height = horizon
    while (height < maxHeight){
        var heightAlpha = map(height, horizon, maxHeight, 10, 200);
        var width = random(-20, 2);
        while (width < maxWidth){   
            var x = width + random(-widthOffset, widthOffset);
            var y = height + random(-heightOffset, heightOffset); 
            drawEyeball(x, y, scaleValue);
            width += widthInterval;
        }
        height += heightInterval;
        heightInterval *= heightFactor;
        heightOffset *= heightFactor;
        widthInterval *= widthFactor;
        widthOffset *= widthFactor;
        scaleValue *= scaleFactor;
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
    drawBackground(horizon);
    drawEyeballs(horizon); 
    
}
