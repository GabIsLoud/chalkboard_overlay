// Select elements
const taskList = document.getElementById("taskList");
const controls = document.getElementById("controls");
const toggleControlsButton = document.getElementById("toggleControls");
let isChalkFont = true;

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.text;
        if (task.crossed) li.classList.add("crossed");
        li.onclick = () => toggleTaskCross(li, task);
        taskList.appendChild(li);
    });
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
    if (controls.style.display === "none") {
        controls.style.display = "block";
    } else {
        controls.style.display = "none";
    }
}

// Load initial font and tasks
document.body.classList.add("cabin-sketch-bold");
loadTasks();
