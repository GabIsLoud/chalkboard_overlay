const taskList = document.getElementById("taskList");
const controls = document.getElementById("controls");
const drawingCanvas = document.getElementById("drawingCanvas");
const toggleControlsButton = document.getElementById("toggleControls");
const drawModeButtons = document.getElementById("drawModeButtons");
const toggleDrawModeButton = document.getElementById("toggleDrawMode");
let isChalkFont = true;
let isDrawing = false;
let isErasing = false;
let context = drawingCanvas.getContext("2d");
let chalkWidth = 5;

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
    if (controls.style.display === "block") {
        document.querySelectorAll('.remove-btn').forEach(btn => btn.style.display = 'inline-block');
    }

    // Hide task list if in draw mode
    if (drawingCanvas.style.display === "block") {
        taskList.style.display = "none";
    } else {
        taskList.style.display = "block";
    }
}

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
    document.body.classList.toggle("cli-font", !isChalkFont);
    document.body.classList.toggle("chalk-font", isChalkFont);
}

// Toggle the visibility of the controls
function toggleControls() {
    if (controls.style.display === "none") {
        controls.style.display = "block";
        document.querySelectorAll('.remove-btn').forEach(btn => btn.style.display = 'inline-block');
    } else {
        controls.style.display = "none";
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
        controls.style.display = "none";
        drawModeButtons.style.display = "block";
        toggleDrawModeButton.style.backgroundColor = "#ff5050"; // Change color to red
    } else {
        drawingCanvas.style.display = "none";
        taskList.style.display = "block";
        controls.style.display = "block";
        drawModeButtons.style.display = "none";
        toggleDrawModeButton.style.backgroundColor = "#505050"; // Change color back to default
    }
}

// Drawing on the canvas
drawingCanvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    context.beginPath();
    context.moveTo(e.offsetX, e.offsetY);
});

drawingCanvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
        if (isErasing) {
            context.clearRect(e.offsetX, e.offsetY, 10, 10);
        } else {
            context.lineTo(e.offsetX, e.offsetY);
            context.strokeStyle = "white";
            context.lineWidth = chalkWidth;
            context.stroke();
        }
    }
});

drawingCanvas.addEventListener("mouseup", () => {
    isDrawing = false;
});

drawingCanvas.addEventListener("mouseout", () => {
    isDrawing = false;
});

// Toggle eraser
function toggleEraser() {
    isErasing = !isErasing;
    const eraserButton = drawModeButtons.querySelector("button:nth-child(1)");
    eraserButton.classList.toggle("eraser-active", isErasing);
}

// Clear the canvas
function clearCanvas() {
    context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
}

// Change chalk width
function changeChalkWidth(newWidth) {
    chalkWidth = newWidth;
}

// Load initial font and tasks
document.body.classList.add("cabin-sketch-bold");
loadTasks();
