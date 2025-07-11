const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const searchInput = document.getElementById('searchInput');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';
let searchQuery = '';

renderTasks();
loadTheme();

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
        const matchesFilter = filter === 'all' || (filter === 'active' && !task.completed) || (filter === 'completed' && task.completed);
        const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        li.innerHTML = `
            <span>${task.text}</span>
            <span class="category category-${task.category}">[${task.category}]</span>
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

searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value;
    renderTasks();
});

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskCount() {
    const activeCount = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `Активных задач: ${activeCount}`;
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function loadTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }
}

function completeAll() {
    tasks.forEach(task => task.completed = true);
    saveTasks();
    renderTasks();
}

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});