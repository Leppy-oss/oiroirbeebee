/***
 *     _____ ___________ _____ _________________ _____ ___________ _____ _____ 
 *    |  _  |_   _| ___ \  _  |_   _| ___ \ ___ \  ___|  ___| ___ \  ___|  ___|
 *    | | | | | | | |_/ / | | | | | | |_/ / |_/ / |__ | |__ | |_/ / |__ | |__  
 *    | | | | | | |    /| | | | | | |    /| ___ \  __||  __|| ___ \  __||  __| 
 *    \ \_/ /_| |_| |\ \\ \_/ /_| |_| |\ \| |_/ / |___| |___| |_/ / |___| |___ 
 *     \___/ \___/\_| \_|\___/ \___/\_| \_\____/\____/\____/\____/\____/\____/ 
 *                                                                             
 *                                                                             
 *    ____________ ___________  ________   _____   _   _  __   ___   _         
 *    | ___ \ ___ \  _  |  _  \ | ___ \ \ / / _ \ | \ | | \ \ / / | | |        
 *    | |_/ / |_/ / | | | | | | | |_/ /\ V / /_\ \|  \| |  \ V /| | | |        
 *    |  __/|    /| | | | | | | |    /  \ /|  _  || . ` |  /   \| | | |        
 *    | |   | |\ \\ \_/ / |/ /  | |\ \  | || | | || |\  | / /^\ \ |_| |        
 *    \_|   \_| \_|\___/|___(_) \_| \_| \_/\_| |_/\_| \_/ \/   \/\___/         
 *                                                                             
 *                                                                             
 *     _____  _____  _____  _____                                              
 *    / __  \|  _  |/ __  \/ __  \                                             
 *    `' / /'| |/' |`' / /'`' / /'                                             
 *      / /  |  /| |  / /    / /                                               
 *    ./ /___\ |_/ /./ /___./ /___                                             
 *    \_____/ \___/ \_____/\_____/                                             
 *                                                                             
 *                                                                             
 */

const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
const exportText = document.getElementById('export-text');
const selection = document.getElementById('selection');
const ffbg = document.getElementById('ffbg');
const copyButton = document.getElementById('copy-button');
const fieldSelection = document.getElementById('field-selection');
const fieldBackgroundImg = document.getElementById('field-img');
const infoPanelDiv = document.getElementById('info-panel');
const pointIndex = document.getElementById('point-index');
const xCoord = document.getElementById('x-coord');
const yCoord = document.getElementById('y-coord');
const heading = document.getElementById('heading');
const headingSlider = document.getElementById('heading-slider');
const tensioningSlider = document.getElementById('tensioning-slider');
const image_path = './images/';
const audio_path = './audio/';
const arrow = new Image(35, 35);
const exportAudio = new Audio(audio_path + 'export.wav');
const failedAudio = new Audio(audio_path + 'exportfailed.wav');
const placeAudio = new Audio(audio_path + 'place.wav');
const rsetAudio = new Audio(audio_path + 'reset.wav');
const toggleAudio = new Audio(audio_path + 'toggle.wav');
const indexAudio = new Audio(audio_path + 'index.mp3');

arrow.src = image_path + 'arrowwhite.png';

var selectedPoint = 0;
var selectionPoint = 0;
var prevSelectedPoint = 0;
var pathPointsPrevIndex = 0;
var prevdocwidth = 0;
var prevdocheight = 0;
var width = canvas.width;
var height = canvas.height;
var shadowing = false;
var pathing = false;
var selecting = false;
var precision = 2;
var tensioning = 0.5;
var prec = 1000;
var cursorX = width / 2;
var cursorY = height / 2;
var lang = 'java';

class Point {
    constructor(x, y, heading, radius) {
        this.x = x;
        this.y = y;
        this.tangent = [0, 0, 0];
        this.heading = heading;
        this.radius = radius ? radius : 5;
        this.draw = function() {
            colorCircle(this.x, this.y, this.radius)
        }
    }
}

function drawCurve(ctx, ptsa, tension, precision) {
    ctx.save();
    ctx.strokeStyle = 'rgba(19, 131, 237, 0.49)';

    ctx.beginPath();

    drawLines(ctx, getCurvePoints(ptsa, tension, precision));
    ctx.lineWidth = 3;

    ctx.stroke();
    ctx.restore();
}

let pathPoints = [];
let shadowPoints = [new Point(width / 2, height / 2, 0, 0)];

function getCurvePoints(pts, tension, precision) {
    tension = (typeof tension != 'undefined') ? tension : 0.5;
    precision = precision ? precision : prec;

    var _pts = [],
        res = [],
        x, y,
        t1x, t2x, t1y, t2y,
        c1, c2, c3, c4,
        st, t, i;

    for (let i = 0; i < pts.length; i++) {
        _pts.push(pts[i].x, pts[i].y);
    }

    _pts.unshift(pts[0].y);
    _pts.unshift(pts[0].x);
    _pts.push(pts[pts.length - 1].x);
    _pts.push(pts[pts.length - 1].y);

    for (i = 2; i < (_pts.length - 4); i += 2) {
        for (t = 0; t <= precision; t++) {

            t1x = (_pts[i + 2] - _pts[i - 2]) * tension;
            t2x = (_pts[i + 4] - _pts[i]) * tension;

            t1y = (_pts[i + 3] - _pts[i - 1]) * tension;
            t2y = (_pts[i + 5] - _pts[i + 1]) * tension;

            st = t / precision;

            c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1;
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
            c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st;
            c4 = Math.pow(st, 3) - Math.pow(st, 2);

            x = c1 * _pts[i] + c2 * _pts[i + 2] + c3 * t1x + c4 * t2x;
            y = c1 * _pts[i + 1] + c2 * _pts[i + 3] + c3 * t1y + c4 * t2y;

            res.push(x);
            res.push(y);
        }
    }

    return res;
}

function drawLines(ctx, pts) {
    ctx.moveTo(pts[0], pts[1]);
    for (i = 2; i < pts.length - 1; i += 2) {
        ctx.lineTo(pts[i], pts[i + 1]);
    }
}

function getCursorCoords(canvas, event) {
    try {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return { x, y };
    } catch (e) {}
}

function resetAudio(audio, time) {
    time = time ? time : 0;
    audio.pause();
    audio.currentTime = time;
}

function mouseDownHandler(canvas, event) {
    if (selecting) {
        resetAudio(indexAudio);
        indexAudio.play();
        selectedPoint = selectionPoint;
    }
    if (pathing && shadowing) {
        resetAudio(placeAudio);
        placeAudio.play();
        const last = shadowPoints.length - 1;
        const clonedShadowPoint = Object.assign({}, shadowPoints[last]);
        const clonedPathPoint = Object.assign({}, clonedShadowPoint);
        pathPoints.push(clonedPathPoint);
        shadowPoints.push(clonedShadowPoint);
    }
}

function mouseMoveHandler(canvas, event) {
    const { x, y } = getCursorCoords(canvas, event)
    cursorX = x;
    cursorY = y;
    for (let i = pathPointsPrevIndex; i < pathPoints.length; i++) {
        if (shadowing) {
            if (distance(x, y, pathPoints[i].x, pathPoints[i].y) < 10 * width / 800) {
                cursorX = pathPoints[i].x;
                cursorY = pathPoints[i].y;
                pathPointsPrevIndex = i;
                break;
            } else {
                pathPointsPrevIndex = 0;
            }
        }
    }
    if (shadowing) {
        shadowPoints[shadowPoints.length - 1].x = cursorX;
        shadowPoints[shadowPoints.length - 1].y = cursorY;
    }
}

function debugPoints() {
    console.log(pathPoints);
    console.log(shadowPoints);
}

function keyDownHandler(event) {
    if (event.keyCode == 81) toggle();
    else if (event.keyCode == 82) reset();
    else if (event.keyCode == 32) debugPoints();
    else if (event.keyCode == 73) {
        indexForward();
    } else if (event.keyCode == 79) resetHeadings();
}

function indexForward() {
    resetAudio(indexAudio);
    indexAudio.play();
    if (selectedPoint < pathPoints.length - 1) selectedPoint++;
    else selectedPoint = 0;
}

function tensioningSliderUpdate() {
    tensioning = tensioningSlider.value;
}

function colorCircle(x, y, r) {
    r *= width / 800;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    // ctx.fillStyle = 'rgba(26, 225, 22, 0.49)';
    ctx.fillStyle = 'rgba(19, 131, 237, 0.49)';
    ctx.fill();
}

function toggle() {
    resetAudio(toggleAudio);
    toggleAudio.play();
    pathing = !pathing;
    shadowing = !shadowing;
    if (pathing) document.getElementById('start-stop-button').innerHTML = 'Stop (Q)';
    else document.getElementById('start-stop-button').innerHTML = 'Start (Q)';
}

function derivative(pathpointinitindex) {
    let curvePoints = getCurvePoints(pathPoints, tensioning);
    let initx = pathpointinitindex * 2 * prec;
    let inity = initx + 1;

    let xinc = initx;
    let yinc = inity;
    while ((curvePoints[xinc] - curvePoints[initx] == 0 || curvePoints[yinc] - curvePoints[inity] == 0) && (yinc + 2 < curvePoints.length || initx - 1 > 0)) {
        if (yinc + 2 < curvePoints.length) {
            xinc += 2;
            yinc += 2;
        }
        if (initx - 1 > 0) {
            initx -= 2;
            inity -= 2;
        }
    }
    dx = curvePoints[xinc] - curvePoints[initx];
    dy = -1 * (curvePoints[yinc] - curvePoints[inity]);
    dydx = dy / dx;

    return [dy, dx, dydx];
}

/*
function drawLine(x, y, m) {
    const theta = parseFloat(convertToAngle(m));
    ctx.beginPath();
    ctx.moveTo(x - 50 * Math.cos(theta), y - 50 * Math.sin(theta));
    ctx.lineTo(x + 50 * Math.cos(theta), y + 50 * Math.sin(theta));
    ctx.stroke();
}
*/

function reset() {
    resetAudio(rsetAudio);
    rsetAudio.play();
    pathing = false;
    shadowing = false;
    selecting = false;
    pathPoints = [];
    document.getElementById('start-stop-button').innerHTML = 'Start (Q)';
    shadowPoints = [new Point(width / 2, height / 2, 0)];
    try {
        exportText.innerHTML = '';
    } catch (e) {}
    infoPanelReset();
}

function infoPanelMouseHover(i) {
    pointIndex.innerHTML = 'Hovering Over: Point ' + (i + 1);
    xCoord.innerHTML = 'x: ' + adjust(pathPoints[i].x, true, precision);
    yCoord.innerHTML = 'y: ' + adjust(pathPoints[i].y, false, precision);
    try {
        heading.innerHTML = 'θ: ' + parseFloat(pathPoints[i].heading).toFixed(precision) + '°';
    } catch (e) {}
    headingSlider.style.visibility = 'visible';
}

function infoPanelSelected() {
    pointIndex.innerHTML = 'Selected: Point ' + (selectedPoint + 1);
    xCoord.innerHTML = 'x: ' + adjust(pathPoints[selectedPoint].x, true, precision);
    yCoord.innerHTML = 'y: ' + adjust(pathPoints[selectedPoint].y, false, precision);
    try {
        heading.innerHTML = 'θ: ' + parseFloat(pathPoints[selectedPoint].heading).toFixed(precision) + '°';
    } catch (e) {}
    headingSlider.style.visibility = 'visible';
}

function infoPanelReset() {
    pointIndex.innerHTML = 'No points selected';
    xCoord.innerHTML = ''
    yCoord.innerHTML = '';
    heading.innerHTML = '';
    headingSlider.value = 0;
    headingSlider.style.visibility = 'hidden';
}

function resetHeadings() {
    for (let i = 0; i < pathPoints.length; i++) {
        pathPoints[i].heading = parseFloat(convertToAngle(pathPoints[i].tangent[0], pathPoints[i].tangent[1]));
    }
}

function mouseUpdateHandler() {
    try {
        for (let i = 0; i < pathPoints.length; i++) {
            if (i >= pathPoints.length - 2 && pathing) {
                pathPoints[i].tangent = derivative(i);
                try {
                    pathPoints[i].heading = parseFloat(convertToAngle(pathPoints[i].tangent[0], pathPoints[i].tangent[1]));
                } catch (e) {}
            }
            pathPoints[i].draw();
            ctx.save();
            ctx.translate(pathPoints[i].x, pathPoints[i].y);
            ctx.rotate(-((parseFloat(pathPoints[i].heading)) * Math.PI / 180 + Math.PI / 2));
            ctx.drawImage(arrow, -width / 40, -width / 90, width / 20, width / 20);
            ctx.restore();
        }
        for (let i = 0; i < pathPoints.length; i++) {
            if (distance(cursorX, cursorY, pathPoints[i].x, pathPoints[i].y) < 10 * width / 800) {
                selecting = true;
                //drawLine(pathPoints[i].x, pathPoints[i].y, -1 * pathPoints[i].tangent[2]);
                pathPoints[i].radius = 10;

                headingSlider.value = pathPoints[i].heading;
                infoPanelMouseHover(i);
                prevSelectedPoint = i;
                selectionPoint = i;
                break;
            } else {
                selecting = false;
                selectionPoint = selectedPoint;
                pathPoints[i].radius = 5;
                if (prevSelectedPoint != selectedPoint) {
                    headingSlider.value = parseFloat(pathPoints[selectedPoint].heading).toFixed(precision);
                } else {
                    pathPoints[selectedPoint].heading = parseFloat(headingSlider.value).toFixed(precision);
                }
                prevSelectedPoint = selectedPoint;
                infoPanelSelected();
            }
        }
        pathPoints[selectedPoint].radius = 10;
        pathPoints[selectedPoint].draw();
    } catch (e) {}

    if (pathing) colorCircle(cursorX, cursorY, 7);
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function adjust(value, widthorheight, precision) {
    if (widthorheight) return ((value - width / 2) * 140 / width).toFixed(precision);
    else return ((-1 * value + height / 2) * 140 / height).toFixed(precision);
}

function fieldUrlSelection(inp) {
    return image_path + inp;
}

/*
function resize() {
    if (window.innerWidth < 800 || window.innerHeight < 300) {
        if (window.innerWidth < window.innerHeight) {
            width = window.innerWidth / 2;
            height = width;
        } else {
            height = window.innerHeight / 2;
            width = height;
        }
    } else {
        if (window.innerWidth > window.innerHeight) {
            width = window.innerWidth / 2;
            height = width;
        } else {
            height = window.innerHeight / 2;
            width = height;
        }
    }

    canvas.width = width;
    canvas.height = height;
    prevdocwidth = window.innerWidth;
    prevdocheight = window.innerHeight;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
}
*/

function convertToAngle(dy, dx) {
    return (Math.atan2(dy, dx) * 180 / Math.PI % 360);
}

function splicePathPoints() {
    let ret = [];
    for (let i = 0; i < pathPoints.length; i++) {
        ret.push(pathPoints[i].x, pathPoints[i].y);
    }

    return ret;
}

function update() {
    ctx.clearRect(0, 0, width, height);
    tensioningSliderUpdate();
    try {
        if (shadowing) drawCurve(ctx, shadowPoints, tensioning);
        else drawCurve(ctx, pathPoints, tensioning);
    } catch (e) {}
    mouseUpdateHandler();
    lang = selection.options[selection.selectedIndex].value;
    field = fieldSelection.options[fieldSelection.selectedIndex].value;
    canvas.style.backgroundImage = 'url(' + fieldUrlSelection(field) + '.jpeg)';
    //alertResize();
}

function alertResize() {
    if (prevdocwidth != window.innerWidth || prevdocheight != window.innerHeight) {
        prevdocwidth = window.innerWidth;
        prevdocheight = window.innerHeight;
        alert('Reload the page to to resize the canvas');
    }
}

function exportToCode() {
    let text = '';
    if (pathPoints.length > 1) {
        resetAudio(exportAudio);
        exportAudio.play();
        switch (lang) {
            case ('kotlin'):
                {
                    text = '.trajectorySequenceBuilder(Pose2d(' + adjust(pathPoints[0].x, true, precision) + ', ' + adjust(pathPoints[0].y, false, precision) + ', Math.toRadians(' + parseFloat(pathPoints[0].heading).toFixed(precision) + ')))';
                    text += '<br>';
                    for (let i = 1; i < pathPoints.length; i++) {
                        text += '.splineToSplineHeading(Pose2d(' + adjust(pathPoints[i].x, true, precision) + ', ' + adjust(pathPoints[i].y, false, precision) + ', Math.toRadians(' + parseFloat(pathPoints[i].heading).toFixed(precision) + '))' + ', Math.toRadians(' + parseFloat(convertToAngle(pathPoints[i].tangent[0], pathPoints[i].tangent[1])).toFixed(precision) + '))<br>';
                    }
                    text += '.build()';
                    break;
                }
            case ('java'):
            default:
                {
                    text = '.trajectorySequenceBuilder(new Pose2d(' + adjust(pathPoints[0].x, true, precision) + ', ' + adjust(pathPoints[0].y, false, precision) + ', Math.toRadians(' + parseFloat(pathPoints[0].heading).toFixed(precision) + ')))';
                    text += '<br>';
                    for (let i = 1; i < pathPoints.length; i++) {
                        text += '.splineToSplineHeading(new Pose2d(' + adjust(pathPoints[i].x, true, precision) + ', ' + adjust(pathPoints[i].y, false, precision) + ', Math.toRadians(' + parseFloat(pathPoints[i].heading).toFixed(precision) + '))' + ', Math.toRadians(' + parseFloat(convertToAngle(pathPoints[i].tangent[0], pathPoints[i].tangent[1])).toFixed(precision) + '))<br>';
                    }
                    text += '.build();';
                }
        }
    } else if (pathPoints.length > 0) {
        resetAudio(failedAudio, 0.1);
        failedAudio.play();
        text = 'roadrunner requires at least 2 points to work!';
    } else {
        resetAudio(failedAudio, 0.1);
        failedAudio.play();
        text = 'start pathing first!';
    }

    exportText.innerHTML = text;
}

canvas.addEventListener('mousedown', e => { mouseDownHandler(canvas, e); });
canvas.addEventListener('mousemove', e => { mouseMoveHandler(canvas, e); });
document.addEventListener('keydown', e => { keyDownHandler(e); });

console.log(`
----------------------------------------------------------------------------
╭━━━┳━━┳━━━┳━━━┳━━┳━━━┳━━╮╭━━━┳━━━┳━━╮╭━━━┳━━━╮
┃╭━╮┣┫┣┫╭━╮┃╭━╮┣┫┣┫╭━╮┃╭╮┃┃╭━━┫╭━━┫╭╮┃┃╭━━┫╭━━╯
┃┃╱┃┃┃┃┃╰━╯┃┃╱┃┃┃┃┃╰━╯┃╰╯╰┫╰━━┫╰━━┫╰╯╰┫╰━━┫╰━━╮
┃┃╱┃┃┃┃┃╭╮╭┫┃╱┃┃┃┃┃╭╮╭┫╭━╮┃╭━━┫╭━━┫╭━╮┃╭━━┫╭━━╯
┃╰━╯┣┫┣┫┃┃╰┫╰━╯┣┫┣┫┃┃╰┫╰━╯┃╰━━┫╰━━┫╰━╯┃╰━━┫╰━━╮
╰━━━┻━━┻╯╰━┻━━━┻━━┻╯╰━┻━━━┻━━━┻━━━┻━━━┻━━━┻━━━╯
╭━━━┳━━━┳━━━┳━━━╮╱╭━━━┳╮╱╱╭┳━━━┳━╮╱╭╮╭━╮╭━┳╮╱╭╮
┃╭━╮┃╭━╮┃╭━╮┣╮╭╮┃╱┃╭━╮┃╰╮╭╯┃╭━╮┃┃╰╮┃┃╰╮╰╯╭┫┃╱┃┃
┃╰━╯┃╰━╯┃┃╱┃┃┃┃┃┃╱┃╰━╯┣╮╰╯╭┫┃╱┃┃╭╮╰╯┃╱╰╮╭╯┃┃╱┃┃
┃╭━━┫╭╮╭┫┃╱┃┃┃┃┃┃╱┃╭╮╭╯╰╮╭╯┃╰━╯┃┃╰╮┃┃╱╭╯╰╮┃┃╱┃┃
┃┃╱╱┃┃┃╰┫╰━╯┣╯╰╯┣╮┃┃┃╰╮╱┃┃╱┃╭━╮┃┃╱┃┃┃╭╯╭╮╰┫╰━╯┃
╰╯╱╱╰╯╰━┻━━━┻━━━┻╯╰╯╰━╯╱╰╯╱╰╯╱╰┻╯╱╰━╯╰━╯╰━┻━━━╯
╱╱╭━╮╭━╮╱╱╭━━━┳━━━┳━━━┳━━━╮╭━━━━╮╱╱╱╱╭╮╱╱╱╱╱╱╱╱╭╮╱╱╱╱╭╮╱╱╱╱╭━━━┳━━━┳━━━┳━━━╮
╱╭╯╭╯╰╮╰╮╱┃╭━╮┃╭━╮┃╭━╮┃╭━╮┃┃╭╮╭╮┃╱╱╱╱┃┃╱╱╱╱╱╱╱╱┃┃╱╱╱╭╯╰╮╱╱╱┃╭━╮┃╭━━┫╭━━┫╭━━╯
╭╯╭╋━━╋╮╰╮╰╯╭╯┃┃┃┃┣╯╭╯┣╯╭╯┃╰╯┃┃┣┻━┳━━┫╰━┳━╮╭┳━━┫╰━┳━┻╮╭╋━━╮┃╰━╯┃╰━━┫╰━━┫╰━━╮
┃┃┃┃╭━╯┃┃┃╭━╯╭┫┃┃┃┣━╯╭╋━╯╭╯╱╱┃┃┃┃━┫╭━┫╭╮┃╭╮╋┫╭━┫╭╮┃╭╮┃┃┃━━┫┃╭━╮┣━━╮┃╭━╮┣━━╮┃
┃┃┃┃╰━╮┃┃┃┃┃╰━┫╰━╯┃┃╰━┫┃╰━╮╱╱┃┃┃┃━┫╰━┫┃┃┃┃┃┃┃╰━┫╰╯┃╰╯┃╰╋━━┃┃╰━╯┣━━╯┃╰━╯┣━━╯┃
╰╮╰╋━━╋╯╭╯╰━━━┻━━━┻━━━┻━━━╯╱╱╰╯╰━━┻━━┻╯╰┻╯╰┻┻━━┻━━┻━━┻━┻━━╯╰━━━┻━━━┻━━━┻━━━╯
╱╰╮╰╮╭╯╭╯
╱╱╰━╯╰━╯

We're always on the lookout for talented new team members...
Want to apply next season?
--> https://flyset.org/first-recruiting/
----------------------------------------------------------------------------
`);
setInterval(update);