// Select elements
const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
let isChalkFont = true;

// Add a new task
function addTask() {
    if (taskInput.value.trim() !== "") {
        const li = document.createElement("li");
        li.textContent = taskInput.value;
        li.onclick = () => li.classList.toggle("crossed");
        taskList.appendChild(li);
        taskInput.value = "";
    }
}

// Toggle between fonts
function toggleFont() {
    isChalkFont = !isChalkFont;
    document.body.classList.toggle("cli-font", !isChalkFont);
    document.body.classList.toggle("chalk-font", isChalkFont);
}

// Load initial font
document.body.classList.add("chalk-font");
