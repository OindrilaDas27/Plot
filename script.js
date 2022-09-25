const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
ctx = canvas.getContext("2d");

// global variables with default values
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5;

window.addEventListener("load", () => {
    //setting canvas width and height // offsetWidth/Height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

const drawRect = (e) => {
    // if fill color is not checked then draw a rect with border else draw rect with background
    if(!fillColor.checked) {
        // creating a circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);   
}

const drawCircle = (e) => {
    ctx.beginPath(); //creating a new path to draw circle
    // getting radius for circle according to the mouse pointer
    let radius = Mat.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, 0, 2 * Math.PI); //creating circle according to the mouse pointer
    ctx.stroke();
    fillColor.checked ? ctx.fill() : ctx.stroke(); //if fillColor is checked fill circle else draw border circle
}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; //passing current MouseX position as prevMouseX value
    prevMouseY = e.offsetY; //passing current MouseY position as prevMouseY value 
    ctx.beginPath(); //creating new path to draw
    ctx.lineWidth = brushWidth; //passing brushSize as line width
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height); //coping canvas data and passing as snapshot value.. this avoids dragging the image
}

const drawing = (e) => {
    if(!isDrawing) return; //if isDrawing is flase return form here
    ctx.putImageData(snapshot, 0, 0); //adding the copied canvas on to this canvas

    if(selectedTool === "brush"){
        ctx.lineTo(e.offsetX, e.offsetY); //creating line according to the mouse pointer
        ctx.stroke(); //drawin/filling line with color
    } else if (selectedTool === "rectangle"){
        drawRect(e);
    }else if (selectedTool === "circle"){
        drawCircle(e);
    }
}   

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { //adding click event to all tool option
        // removing active class from the pervious option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(btn.id);
    });
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);