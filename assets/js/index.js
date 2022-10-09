const canvas = document.querySelector("canvas"),
  clearCanvas = document.querySelector("#clear-canvas"),
  saveCanvas = document.querySelector("#save-canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#bucket"),
  brushWidthSlider = document.querySelector("#brush-width-slider"),
  colorBtns = document.querySelectorAll(".color"),
  colorPicker = document.querySelector("#color-picker");

// canvas context options
const ctxOptions = {
  // readback optimization: //https://html.spec.whatwg.org/multipage/canvas.html#concept-canvas-will-read-frequently
  willReadFrequently: true,
};

// canvas context
const ctx = canvas.getContext("2d", ctxOptions);

// global variables with default values
let prevMouseX,
  prevMouseY,
  snapshot,
  isDrawing = false,
  selectedTool = "pencil",
  brushWidth = brushWidthSlider.value,
  selectedColor = "#000";

// on window load
window.addEventListener("load", () => {
  const parent = canvas.parentNode,
    styles = getComputedStyle(parent),
    w = parseInt(styles.getPropertyValue("width"), 10),
    h = parseInt(styles.getPropertyValue("height"), 10);

  canvas.width = w;
  canvas.height = h;
  //setting canvas width and height // offsetWidth/Height returns viewable width/height of an element
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});

/**
 * functions/methods
 */

/**
 * @name drawRect
 * @param {*} e
 * @returns
 */
const drawRect = (e) => {
  // if fill color is not checked then draw a rect with border else draw rect with background
  if (!fillColor.checked) {
    // creating a circle according to the mouse pointer
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};

/**
 * @name drawCircle
 * @param {*} e
 * @returns
 */
const drawCircle = (e) => {
  ctx.beginPath(); //creating a new path to draw circle
  // getting radius for circle according to the mouse pointer
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); //creating circle according to the mouse pointer
  ctx.stroke();
  fillColor.checked ? ctx.fill() : ctx.stroke(); //if fillColor is checked fill circle else draw border circle
};

/**
 * @name drawTriangle
 * @param {*} e
 * @returns
 */
const drawTriangle = (e) => {
  ctx.beginPath(); //creating new path to draw circle
  ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
  ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // creating bottom line of the triangle
  ctx.closePath(); // closing path of the triangle so the third line draw automatically
  ctx.stroke();
  fillColor.checked ? ctx.fill() : ctx.stroke(); //if fillColor is checked fill circle else draw border triangle
};

/**
 * @name startDraw
 * @param {*} e
 * @returns
 */
const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX; //passing current MouseX position as prevMouseX value
  prevMouseY = e.offsetY; //passing current MouseY position as prevMouseY value
  ctx.beginPath(); //creating new path to draw
  ctx.lineWidth = brushWidth; //passing brushSize as line width
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height); //coping canvas data and passing as snapshot value.. this avoids dragging the image
  ctx.strokeStyle = selectedColor; // passing selectedColor as stroke syle
  ctx.fillStyle = selectedColor; // passing selectedColor as fill style
};

const drawing = (e) => {
  if (!isDrawing) return; //if isDrawing is flase return form here
  ctx.putImageData(snapshot, 0, 0); //adding the copied canvas on to this canvas

  switch (selectedTool) {
    case "pencil":
      // pencil is thin
      ctx.lineWidth = 2;
      //creating line according to the mouse pointer
      ctx.lineTo(e.offsetX, e.offsetY);
      //drawin/filling line with color
      ctx.stroke();
      return;
    case "brush":
      //creating line according to the mouse pointer
      ctx.lineTo(e.offsetX, e.offsetY);
      //drawin/filling line with color
      ctx.stroke();
      return;
    case "rectangle":
      drawRect(e);
      return;
    case "circle":
      drawCircle(e);
      return;
    case "triangle":
      drawTriangle(e);
      return;
  }
};

// clear canvas
clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// save image
saveCanvas.addEventListener("click", () => {
  let e = document.getElementById("fileFormat");
  let selectedFormat = e.options[e.selectedIndex].text;
  const img = canvas.toDataURL(`image/${selectedFormat}`);
  downloadImage(img, `draw-${new Date().getMilliseconds()}.${selectedFormat}`);
});

// tools & shapes
toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.id === "pencil") {
      // disable brush width slider
      brushWidthSlider.disabled = true;
    } else {
      // enable brush width slider
      brushWidthSlider.disabled = false;
    }
    //adding click event to all tool option
    // removing active class from the pervious option and adding on current clicked option
    document.querySelector(".tool.active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
    canvas.id = selectedTool;
  });
});

// brush thickness
brushWidthSlider.addEventListener("change", () => {
  if (selectedTool === "pencil") {
    brushWidth = 2;
    return;
  }

  brushWidth = brushWidthSlider.value;
  return;
});

// color presets
colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // adding click event to all color button
    // removing active class from the previous option and adding on current clicked option
    document.querySelector(".color.selected").classList.remove("selected");
    btn.classList.add("selected");
    // passing selected btn background as selectedColor value
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});

// color picker
colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

// download image
const downloadImage = (data, filename = "untitled.jpeg") => {
  var a = document.createElement("a");
  a.href = data;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
};

/**
 * canvas event listeners
 */
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => (isDrawing = false));
