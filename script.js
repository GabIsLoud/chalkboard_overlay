const taskList = document.getElementById("taskList");
const controls = document.getElementById("controls");
const toggleControlsButton = document.getElementById("toggleControls");
let isChalkFont = true;
let penSize = 10; // Default pen size

const indicatorCanvas = document.getElementById("indicatorCanvas");
const indicatorCtx = indicatorCanvas.getContext("2d");

function drawIndicator(x, y) {
    indicatorCtx.clearRect(0, 0, indicatorCanvas.width, indicatorCanvas.height);
    indicatorCtx.beginPath();
    indicatorCtx.arc(x, y, penSize / 2, 0, Math.PI * 2);
    indicatorCtx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    indicatorCtx.lineWidth = 2;
    indicatorCtx.stroke();
}

indicatorCanvas.width = window.innerWidth;
indicatorCanvas.height = window.innerHeight;

document.addEventListener("mousemove", (e) => {
    drawIndicator(e.clientX, e.clientY);
});

document.addEventListener("mousedown", () => {
    indicatorCtx.clearRect(0, 0, indicatorCanvas.width, indicatorCanvas.height);
});

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task.text;
        if (task.crossed) li.classList.add("crossed");
        li.onclick = () => toggleTaskCross(li, task);

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "-";
        removeBtn.className = "remove-btn";
        removeBtn.onclick = (e) => {
            e.stopPropagation();
            removeTask(index);
        };
        li.appendChild(removeBtn);

        taskList.appendChild(li);
    });

    if (controls.style.display === "block") {
        document.querySelectorAll('.remove-btn').forEach(btn => btn.style.display = 'inline-block');
    }
}

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

function removeTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function toggleTaskCross(li, task) {
    task.crossed = !task.crossed;
    li.classList.toggle("crossed");
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleFont() {
    isChalkFont = !isChalkFont;
    document.body.classList.toggle("cli-font", !isChalkFont);
    document.body.classList.toggle("chalk-font", isChalkFont);
}

function toggleControls() {
    if (controls.style.display === "none") {
        controls.style.display = "block";
        document.querySelectorAll('.remove-btn').forEach(btn => btn.style.display = 'inline-block');
    } else {
        controls.style.display = "none";
        document.querySelectorAll('.remove-btn').forEach(btn => btn.style.display = 'none');
    }
}

document.body.classList.add("cabin-sketch-bold");
loadTasks();
