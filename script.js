let todos = JSON.parse(localStorage.getItem("todos")) || [];

let editIndex = -1;

// Display Tasks
function displayTodos(list = todos) {

    const todoList = document.getElementById("todoList");

    todoList.innerHTML = "";

    list.forEach((todo, index) => {

        todoList.innerHTML += `
            <li>
                <div class="todo-card">

                    <h3>${todo.title}</h3>

                    <p><strong>Category:</strong> ${todo.category}</p>

                    <p><strong>Priority:</strong> ${todo.priority}</p>

                    <p><strong>Status:</strong> ${todo.status}</p>

                    <p><strong>Start:</strong> ${todo.startDate}</p>

                    <p><strong>End:</strong> ${todo.endDate}</p>

                    <div class="actions">

                        <button class="view" onclick="viewTodo(${index})">
                            View
                        </button>

                        <button class="edit" onclick="editTodo(${index})">
                            Edit
                        </button>

                        <button class="delete" onclick="deleteTodo(${index})">
                            Delete
                        </button>

                    </div>

                </div>
            </li>
        `;

    });

    updateStats();

    localStorage.setItem("todos", JSON.stringify(todos));

}

// Add / Update Task
function addTodo() {

    const title = document.getElementById("todoInput").value.trim();

    const category = document.getElementById("category").value.trim();

    const priority = document.getElementById("priority").value;

    const status = document.getElementById("status").value;

    const startDate = document.getElementById("startDate").value;

    const endDate = document.getElementById("endDate").value;

    if (
        title === "" ||
        category === "" ||
        priority === "" ||
        status === "" ||
        startDate === "" ||
        endDate === ""
    ) {

        alert("Please fill all fields.");

        return;

    }

    const todo = {

        title,
        category,
        priority,
        status,
        startDate,
        endDate

    };

    if (editIndex === -1) {

        todos.push(todo);

    } else {

        todos[editIndex] = todo;

        editIndex = -1;

    }

    clearForm();

    displayTodos();

}

// View Task
function viewTodo(index) {

    const todo = todos[index];

    document.getElementById("todoDetails").innerHTML = `
        <p><strong>Task:</strong> ${todo.title}</p>
        <p><strong>Category:</strong> ${todo.category}</p>
        <p><strong>Priority:</strong> ${todo.priority}</p>
        <p><strong>Status:</strong> ${todo.status}</p>
        <p><strong>Start Date:</strong> ${todo.startDate}</p>
        <p><strong>End Date:</strong> ${todo.endDate}</p>
    `;

    document.getElementById("modal").style.display = "flex";

}

// Close Modal
function closeModal() {

    document.getElementById("modal").style.display = "none";

}

// Edit Task
function editTodo(index) {

    const todo = todos[index];

    document.getElementById("todoInput").value = todo.title;

    document.getElementById("category").value = todo.category;

    document.getElementById("priority").value = todo.priority;

    document.getElementById("status").value = todo.status;

    document.getElementById("startDate").value = todo.startDate;

    document.getElementById("endDate").value = todo.endDate;

    editIndex = index;

}

// Delete Task
function deleteTodo(index) {

    if (confirm("Delete this task?")) {

        todos.splice(index, 1);

        displayTodos();

    }

}

// Search
document.getElementById("searchTask").addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase();

    const filtered = todos.filter(todo =>

        todo.title.toLowerCase().includes(keyword) ||

        todo.category.toLowerCase().includes(keyword)

    );

    displayTodos(filtered);

});

// Statistics
function updateStats() {

    document.getElementById("totalTasks").textContent = todos.length;

    const pending = todos.filter(todo => todo.status === "Pending").length;

    const completed = todos.filter(todo => todo.status === "Completed").length;

    document.getElementById("pendingTasks").textContent = pending;

    document.getElementById("completedTasks").textContent = completed;

}

// Clear Form
function clearForm() {

    document.getElementById("todoInput").value = "";

    document.getElementById("category").value = "";

    document.getElementById("priority").value = "";

    document.getElementById("status").value = "";

    document.getElementById("startDate").value = "";

    document.getElementById("endDate").value = "";

}

// Close Modal Outside Click
window.onclick = function(event) {

    const modal = document.getElementById("modal");

    if (event.target === modal) {

        closeModal();

    }

};

// Load Tasks
displayTodos();