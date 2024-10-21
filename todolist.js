// Get elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Initialize task array
let tasks = [];

// Function to add task
function addTask(task) {
    tasks.push(task);
    renderTaskList();
}

// Function to render task list
function renderTaskList() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task;
        li.addEventListener('click', () => {
            tasks.splice(index, 1);
            renderTaskList();
        });
        if (tasks[index].done) {
            li.classList.add('done');
        }
        taskList.appendChild(li);
    });
}

// Add event listener to add task button
addTaskBtn.addEventListener('click', () => {
    const task = taskInput.value.trim();
    if (task) {
        addTask({ text: task, done: false });
        taskInput.value = '';
    }
});

// Add event listener to task input (press enter)
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const task = taskInput.value.trim();
        if (task) {
            addTask({ text: task, done: false });
            taskInput.value = '';
        }
    }
});
