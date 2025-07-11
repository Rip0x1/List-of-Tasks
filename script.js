const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

renderTasks();

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Введите задачу!');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        category: categorySelect.value,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
}

function renderTasks() {
    taskList.innerHTML = '';
    let filteredTasks = tasks.filter(task => {
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        li.innerHTML = `
            <span>${task.text}</span>
            <span class="category">[${task.category}]</span>
        `;

        const completeBtn = document.createElement('button');
        completeBtn.textContent = '✔';
        completeBtn.onclick = () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        };

        const editBtn = document.createElement('button');
        editBtn.textContent = '✏';
        editBtn.onclick = () => editTask(task.id, li);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.onclick = () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        };

        li.append(completeBtn, editBtn, deleteBtn);
        taskList.appendChild(li);
    });

    updateTaskCount();
}

function editTask(taskId, li) {
    const task = tasks.find(t => t.id === taskId);
    li.innerHTML = '';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = task.text;
    input.classList.add('edit-input');

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Сохранить';
    saveBtn.onclick = () => {
        const newText = input.value.trim();
        if (newText) {
            task.text = newText;
            saveTasks();
            renderTasks();
        } else {
            alert('Введите задачу!');
        }
    };

    li.append(input, saveBtn);
    input.focus();
}

function filterTasks(type) {
    filter = type;
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskCount() {
    const activeCount = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `Активных задач: ${activeCount}`;
}

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});