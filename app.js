const fontSize = document.getElementById("fontsize");
const fontmodeBtn = document.getElementById("fontmode-btn")
const fontSelect = document.getElementById("sel-font");
const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const modeBtn = document.getElementById("mode-btn");
const clearBtn = document.getElementById("clear-btn");
const eraserBtn = document.getElementById("eraser-btn");
const colorOptions = Array.from(
    document.getElementsByClassName("color-option")
    ); // HTMLCollection -> Array : Because of forEach function
const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round"
ctx.font = `${fontSize.value}px ${fontSelect.options[fontSelect.selectedIndex].value}`;

let isPainting = false;
let isFilling = false;
let fontFilling = false;

function onMove(event){
    if (isPainting){
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        return;
    }
    ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting(){
    isPainting = true;
}

function cancelPainting() {
    isPainting = false;
    ctx.beginPath(); // width range등의 적용을 받지 않기 위해 한 번 끊어줌.
}

function onLineWidthChange(event){
    ctx.lineWidth = event.target.value;
}

function onColorChange(event){
    ctx.strokeStyle = event.target.value;
    ctx.fillStyle = event.target.value;
}

function onColorClick(event){
    //console.dir(event.target.dataset.color);
    const colorValue = event.target.dataset.color ;
    ctx.strokeStyle = colorValue;
    ctx.fillStyle = colorValue;
    color.value = colorValue;
}

function onModeClick(){
    if (isFilling){
        isFilling = false
        modeBtn.innerText = "Fill"
    } else {
        isFilling = true
        modeBtn.innerText = "Draw"
    }
}

function onCanvasClick(){
    if (isFilling){
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}

function onClearClick(){
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraserClick(){
    ctx.strokeStyle = "white";
    isFilling = false;
    modeBtn.innerText = "Fill";
}

function onFileChange(event){
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    image.onload = function(){
        ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        fileInput.value = null;
    }
}

function onFontSelector(){
    ctx.font = `${fontSize.value}px ${fontSelect.options[fontSelect.selectedIndex].value}`;
}


function onDoubleClick(event){
    ctx.save(); // save current state color, style everything
    const text = textInput.value;
    if (text !== "") {
        if (fontFilling){
            ctx.lineWidth = 1;
            ctx.fillText(text, event.offsetX, event.offsetY); // options strokeText, fillText
            ctx.restore(); // restore
        } else {
            ctx.lineWidth = 1;
            ctx.strokeText(text, event.offsetX, event.offsetY);
            ctx.restore();
        }
    }
}

function onFontModeChange() {
    if (fontFilling){
        fontFilling = false
        fontmodeBtn.innerText = "Fill"
    } else {
        fontFilling = true
        fontmodeBtn.innerText = "Draw"
    }
}


function onSaveClick() {
    const url = canvas.toDataURL();
    const a = document.createElement("a")
    a.href = url
    a.download = "myDrawing.png"
    a.click();
}


fontSize.addEventListener("change", onFontSelector)
canvas.addEventListener("dblclick", onDoubleClick); //dbclick = mousedown, mouseup - Repeat quickly
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting); //another way : document.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);
lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

colorOptions.forEach(color => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);
clearBtn.addEventListener("click", onClearClick);
eraserBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);
fontSelect.addEventListener("change", onFontSelector);
fontmodeBtn.addEventListener("click", onFontModeChange)