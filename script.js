const taskList = document.getElementById("taskList");
const controls = document.getElementById("controls");
const drawControls = document.getElementById("drawControls");
const drawingCanvas = document.getElementById("drawingCanvas");
const toggleControlsButton = document.getElementById("toggleControls");
let isChalkFont = true;
let isDrawing = false;
let isErasing = false;
let context = drawingCanvas.getContext("2d");
let chalkWidth = 5; // P8c43

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
        drawControls.style.display = "block";
    } else {
        drawControls.style.display = "none";
    }
}

// Toggle between task mode and draw mode
function toggleDrawMode() {
    if (drawingCanvas.style.display === "none") {
        drawingCanvas.style.display = "block";
        taskList.style.display = "none";
        drawControls.style.display = "block";
        controls.style.display = "none";
    } else {
        drawingCanvas.style.display = "none";
        taskList.style.display = "block";
        drawControls.style.display = "none";
        controls.style.display = "block";
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
            context.lineWidth = chalkWidth; // P8c43
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
}

// Clear the canvas
function clearCanvas() {
    context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
}

// Change chalk width
function changeChalkWidth(newWidth) { // P8c43
    chalkWidth = newWidth;
}

// Load initial font and tasks
document.body.classList.add("cabin-sketch-bold");
loadTasks();
