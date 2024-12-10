// Select elements
const taskList = document.getElementById("taskList");
const taskModeControls = document.getElementById("taskModeControls");
const drawModeControls = document.getElementById("drawModeControls");
const drawingCanvas = document.getElementById("drawingCanvas");
const toggleControlsButton = document.getElementById("toggleControls");
const drawModeButtons = document.getElementById("drawModeButtons");
const toggleDrawModeButton = document.getElementById("toggleDrawMode");
const toggleTaskModeButton = document.getElementById("toggleTaskMode");
const chalkWidthDisplay = document.getElementById("chalkWidthDisplay");
let isChalkFont = true;
let isDrawing = false;
let isErasing = false;
let context = drawingCanvas.getContext("2d");
let chalkWidth = 5;

// Correct cursor alignment on the canvas
function getCanvasCoords(event) {
    const rect = drawingCanvas.getBoundingClientRect();
    const scaleX = drawingCanvas.width / rect.width;
    const scaleY = drawingCanvas.height / rect.height;
    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    };
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task.text;
        if (task.crossed) li.classList.add("crossed");
        li.onclick = () => toggleTaskCross(li, task);

        // Add remove button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "-";
        removeBtn.className = "remove-btn";
        removeBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent the click from crossing out the task
            removeTask(index);
        };
        li.appendChild(removeBtn);

        taskList.appendChild(li);
    });

    // Ensure remove buttons are shown if controls are visible
    if (taskModeControls.style.display === "block") {
        document.querySelectorAll('.remove-btn').forEach(btn => btn.style.display = 'inline-block');
    }

    // Hide task list if in draw mode
    if (drawingCanvas.style.display === "block") {
        taskList.style.display = "none";
    } else {
        taskList.style.display = "block";
    }
}

// Drawing on the canvas
function startDrawing(event) {
    isDrawing = true;
    const coords = getCanvasCoords(event);
    context.beginPath();
    context.moveTo(coords.x, coords.y);
}

function draw(event) {
    if (isDrawing) {
        const coords = getCanvasCoords(event);
        if (isErasing) {
            context.clearRect(coords.x - 5, coords.y - 5, 10, 10);
        } else {
            context.lineTo(coords.x, coords.y);
            context.strokeStyle = "white";
            context.lineWidth = chalkWidth;
            context.stroke();
        }
    }
}

function stopDrawing() {
    isDrawing = false;
    context.closePath();
}

drawingCanvas.addEventListener("mousedown", startDrawing);
drawingCanvas.addEventListener("mousemove", draw);
drawingCanvas.addEventListener("mouseup", stopDrawing);
drawingCanvas.addEventListener("mouseout", stopDrawing);

// Add a new task
function addTask() {
    const taskInput = document.getElementById("taskInput");
    if (taskInput.value.trim() !== "") {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ text: taskInput.value.trim(), crossed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
        taskInput.value = "";
    }
}

// Remove a task
function removeTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

// Toggle task crossed state
function toggleTaskCross(li, task) {
    task.crossed = !task.crossed;
    li.classList.toggle("crossed");
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Toggle between fonts
function toggleFont() {
    isChalkFont = !isChalkFont;
    document.body.classList.toggle("doto-pixel", !isChalkFont);
    document.body.classList.toggle("cabin-sketch-bold", isChalkFont);
}

// Toggle the visibility of the controls
function toggleControls() {
    if (taskModeControls.style.display === "none" && drawModeControls.style.display === "none") {
        if (drawingCanvas.style.display === "none") {
            taskModeControls.style.display = "block";
            document.querySelectorAll('.remove-btn').forEach(btn => btn.style.display = 'inline-block');
        } else {
            drawModeControls.style.display = "block";
        }
    } else {
        taskModeControls.style.display = "none";
        drawModeControls.style.display = "none";
        document.querySelectorAll('.remove-btn').forEach(btn => btn.style.display = 'none');
    }

    // Show/hide draw mode controls
    if (drawingCanvas.style.display === "block") {
        drawModeButtons.style.display = "block";
    } else {
        drawModeButtons.style.display = "none";
    }
}

// Toggle between task mode and draw mode
function toggleDrawMode() {
    if (drawingCanvas.style.display === "none") {
        drawingCanvas.style.display = "block";
        taskList.style.display = "none";
        taskModeControls.style.display = "none";
        drawModeControls.style.display = "block";
        drawModeButtons.style.display = "block";
        toggleDrawModeButton.style.backgroundColor = "#ff5050"; // Change color to red
    } else {
        drawingCanvas.style.display = "none";
        taskList.style.display = "block";
        taskModeControls.style.display = "block";
        drawModeControls.style.display = "none";
        drawModeButtons.style.display = "none";
        toggleDrawModeButton.style.backgroundColor = "#505050"; // Change color back to default
        document.querySelectorAll('.remove-btn').forEach(btn => btn.style.display = 'inline-block'); // Show remove buttons
        loadTasks(); // Ensure tasks are loaded when switching to task mode
    }
}

// Toggle eraser
function toggleEraser() {
    isErasing = !isErasing;
    const eraserButton = drawModeButtons.querySelector("button:nth-child(1)");
    eraserButton.classList.toggle("eraser-active", isErasing);
    if (isErasing) {
        eraserButton.style.backgroundColor = "pink";
    } else {
        eraserButton.style.backgroundColor = "white";
    }
}

// Clear the canvas
function clearCanvas() {
    context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
}

// Change chalk width
function changeChalkWidth(newWidth) {
    chalkWidth = newWidth;
    chalkWidthDisplay.textContent = `Width: ${chalkWidth}`;
}

// Increase chalk width
function increaseChalkWidth() {
    changeChalkWidth(chalkWidth + 1);
}

// Decrease chalk width
function decreaseChalkWidth() {
    changeChalkWidth(chalkWidth - 1);
}

// Load initial font and tasks
document.body.classList.add("cabin-sketch-bold");
loadTasks();