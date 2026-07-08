// ===============================
// Professional Todo Application
// ===============================

// Load todos from localStorage or start fresh
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Track which todo is currently being edited (null = adding new)
let editingId = null;

// DOM references
const todoInput   = document.getElementById('todoInput');
const categoryInput = document.getElementById('category');
const priorityInput = document.getElementById('priority');
const statusInput   = document.getElementById('status');
const startDateInput = document.getElementById('startDate');
const endDateInput   = document.getElementById('endDate');
const todoList = document.getElementById('todoList');
const searchInput = document.getElementById('searchTask');
const addBtn = document.querySelector('.input-box button');

const totalTasksEl = document.getElementById('totalTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const completedTasksEl = document.getElementById('completedTasks');

const modal = document.getElementById('modal');
const todoDetails = document.getElementById('todoDetails');

// ===============================
// Utility: generate a unique ID
// ===============================
function generateId() {
    return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
}

// ===============================
// Save to localStorage
// ===============================
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// ===============================
// Add or Update a Task
// ===============================
function addTodo() {
    const title = todoInput.value.trim();
    const category = categoryInput.value.trim();
    const priority = priorityInput.value;
    const status = statusInput.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!title) {
        alert('Please enter a task title.');
        return;
    }

    if (endDate && startDate && endDate < startDate) {
        alert('End date cannot be before start date.');
        return;
    }

    if (editingId) {
        // ---- UPDATE existing task ----
        const todo = todos.find(t => t.id === editingId);
        if (todo) {
            todo.title = title;
            todo.category = category;
            todo.priority = priority;
            todo.status = status;
            todo.startDate = startDate;
            todo.endDate = endDate;
        }
        editingId = null;
        addBtn.textContent = 'Add Task';
    } else {
        // ---- ADD new task ----
        const newTodo = {
            id: generateId(),
            title,
            category,
            priority,
            status,
            startDate,
            endDate,
            createdAt: new Date().toISOString()
        };
        todos.push(newTodo);
    }

    saveTodos();
    clearForm();
    renderTodos();
}

// ===============================
// Clear the input form
// ===============================
function clearForm() {
    todoInput.value = '';
    categoryInput.value = '';
    priorityInput.value = '';
    statusInput.value = '';
    startDateInput.value = '';
    endDateInput.value = '';
}

// ===============================
// Edit a Task (loads data into form)
// ===============================
function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    todoInput.value = todo.title;
    categoryInput.value = todo.category;
    priorityInput.value = todo.priority;
    statusInput.value = todo.status;
    startDateInput.value = todo.startDate;
    endDateInput.value = todo.endDate;

    editingId = id;
    addBtn.textContent = 'Update Task';
    todoInput.focus();
}

// ===============================
// Delete a Task
// ===============================
function deleteTodo(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    todos = todos.filter(t => t.id !== id);

    // If we were editing the task that just got deleted, reset the form
    if (editingId === id) {
        editingId = null;
        addBtn.textContent = 'Add Task';
        clearForm();
    }

    saveTodos();
    renderTodos();
}

// ===============================
// Toggle quick complete status
// ===============================
function toggleComplete(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    todo.status = todo.status === 'Completed' ? 'Pending' : 'Completed';
    saveTodos();
    renderTodos();
}

// ===============================
// Show Task Details Modal
// ===============================
function viewTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    todoDetails.innerHTML = `
        <p><strong>Title:</strong> ${escapeHtml(todo.title)}</p>
        <p><strong>Category:</strong> ${escapeHtml(todo.category) || '—'}</p>
        <p><strong>Priority:</strong> ${escapeHtml(todo.priority) || '—'}</p>
        <p><strong>Status:</strong> ${escapeHtml(todo.status) || '—'}</p>
        <p><strong>Start Date:</strong> ${todo.startDate || '—'}</p>
        <p><strong>End Date:</strong> ${todo.endDate || '—'}</p>
        <p><strong>ID:</strong> ${todo.id}</p>
    `;
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

// Close modal when clicking outside content
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// ===============================
// Escape HTML to prevent injection
// ===============================
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ===============================
// Render Todos (with search filter)
// ===============================
function renderTodos() {
    const query = searchInput.value.trim().toLowerCase();

    const filtered = todos.filter(t =>
        t.title.toLowerCase().includes(query) ||
        (t.category && t.category.toLowerCase().includes(query))
    );

    todoList.innerHTML = '';

    if (filtered.length === 0) {
        todoList.innerHTML = '<li class="empty-state">No tasks found.</li>';
    } else {
        filtered.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-card';
            li.dataset.id = todo.id;

            const priorityClass = (todo.priority || '').toLowerCase();
            const statusClass = (todo.status || '').toLowerCase().replace(' ', '-');

            li.innerHTML = `
                <div class="todo-main">
                    <h3 class="${todo.status === 'Completed' ? 'completed-text' : ''}">
                        ${escapeHtml(todo.title)}
                    </h3>
                    <div class="todo-meta">
                        ${todo.category ? `<span class="tag category">${escapeHtml(todo.category)}</span>` : ''}
                        ${todo.priority ? `<span class="tag priority ${priorityClass}">${escapeHtml(todo.priority)}</span>` : ''}
                        ${todo.status ? `<span class="tag status ${statusClass}">${escapeHtml(todo.status)}</span>` : ''}
                    </div>
                    <div class="todo-dates">
                        ${todo.startDate ? `<span>Start: ${todo.startDate}</span>` : ''}
                        ${todo.endDate ? `<span>End: ${todo.endDate}</span>` : ''}
                    </div>
                </div>
                <div class="todo-actions">
                    <button onclick="viewTodo('${todo.id}')">View</button>
                    <button onclick="toggleComplete('${todo.id}')">
                        ${todo.status === 'Completed' ? 'Mark Pending' : 'Mark Done'}
                    </button>
                    <button onclick="editTodo('${todo.id}')">Edit</button>
                    <button onclick="deleteTodo('${todo.id}')" class="delete-btn">Delete</button>
                </div>
            `;

            todoList.appendChild(li);
        });
    }

    updateStats();
}

// ===============================
// Update Statistics
// ===============================
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.status === 'Completed').length;
    const pending = total - completed;

    totalTasksEl.textContent = total;
    pendingTasksEl.textContent = pending;
    completedTasksEl.textContent = completed;
}

// ===============================
// Search listener
// ===============================
searchInput.addEventListener('input', renderTodos);

// ===============================
// Initial Render
// ===============================
renderTodos();