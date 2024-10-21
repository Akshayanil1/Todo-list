// Get elements
const taskInput = document.getElementById('task-input');
const deadlineInput = document.getElementById('deadline-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const finishedTaskList = document.getElementById('finished-task-list');

// Initialize task arrays
let tasks = [];
let finishedTasks = [];

// Function to add a new task
function addTask(task) {
    tasks.push(task);
    renderTaskList();
    saveTasks();
}

// Function to render the task list
function renderTaskList() {
    taskList.innerHTML = '';
    finishedTaskList.innerHTML = '';

    const currentDate = new Date();

    // Render active tasks
    tasks.forEach((task, index) => {
        const taskDate = new Date(task.deadline);
        const timeRemaining = taskDate - currentDate;
        const li = document.createElement('li');

        li.innerHTML = `
            <span class="${task.done ? 'done' : ''}">${task.text}</span>
            <small>Time left: ${formatTime(timeRemaining)}</small>
            <button class="done-btn">Mark as Done</button>
            <button class="delete-btn">Remove</button>
        `;

        li.querySelector('.done-btn').addEventListener('click', () => {
            task.done = true;
            finishedTasks.push(task);
            tasks.splice(index, 1);
            renderTaskList();
            saveTasks();
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            tasks.splice(index, 1);
            renderTaskList();
            saveTasks();
        });

        taskList.appendChild(li);
    });

    // Render finished tasks
    finishedTasks.forEach((task, index) => {
        const li = document.createElement('li');

        li.innerHTML = `
            <span class="done">${task.text}</span>
            <button class="repeat-btn">Repeat Task</button>
            <button class="delete-btn">Remove</button>
        `;

        li.querySelector('.repeat-btn').addEventListener('click', () => {
            addTask({ text: task.text, deadline: task.deadline, done: false });
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            finishedTasks.splice(index, 1);
            renderTaskList();
            saveTasks();
        });

        finishedTaskList.appendChild(li);
    });
}

// Function to format time remaining
function formatTime(milliseconds) {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
}

// Function to save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('finishedTasks', JSON.stringify(finishedTasks));
}

// Function to load tasks from local storage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    const storedFinishedTasks = localStorage.getItem('finishedTasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    if (storedFinishedTasks) {
        finishedTasks = JSON.parse(storedFinishedTasks);
    }
    renderTaskList();
}

// Add event listener to add task button
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    const deadline = deadlineInput.value;

    if (taskText && deadline) {
        const deadlineDate = new Date(deadline);
        const currentDate = new Date();

        const maxDate = new Date(currentDate);
        maxDate.setDate(maxDate.getDate() + 30);

        if (deadlineDate > currentDate && deadlineDate <= maxDate) {
            addTask({ text: taskText, deadline: deadlineDate.toISOString(), done: false });
            taskInput.value = '';
            deadlineInput.value = '';
        } else {
            alert('Please select a deadline within the next 30 days.');
        }
    } else {
        alert('Please enter a task and select a valid deadline.');
    }
});

// Load tasks when the page loads
loadTasks();
