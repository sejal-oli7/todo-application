// Professional Todo Application



// Local Storage


let todos = JSON.parse(localStorage.getItem("todos")) || [];

let editingId = null;

let statusChart;
let priorityChart;



// DOM Elements



const todoInput = document.getElementById("todoInput");
const categoryInput = document.getElementById("category");
const priorityInput = document.getElementById("priority");
const statusInput = document.getElementById("status");

const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");


const todoList = document.getElementById("todoList");

const searchInput =
document.getElementById("searchTask");


const addBtn =
document.querySelector(".input-box button");


const totalTasksEl =
document.getElementById("totalTasks");


const pendingTasksEl =
document.getElementById("pendingTasks");


const completedTasksEl =
document.getElementById("completedTasks");



// Modal

const modal =
document.getElementById("modal");

const todoDetails =
document.getElementById("todoDetails");





// Save Data



function saveTodos(){

    localStorage.setItem(
        "todos",
        JSON.stringify(todos)
    );

}




// Generate ID



function generateId(){

    return Date.now();

}




// Add Task



function addTodo(){


    let title =
    todoInput.value.trim();


    if(title===""){

        alert("Enter task title");

        return;

    }



    let task = {


        id:
        editingId || generateId(),


        title,


        category:
        categoryInput.value,


        priority:
        priorityInput.value,


        status:
        statusInput.value || "Pending",


        startDate:
        startDateInput.value,


        endDate:
        endDateInput.value,


        createdAt:
        new Date()

    };





    if(editingId){


        todos =
        todos.map(
            t =>
            t.id===editingId
            ?
            task
            :
            t
        );


        editingId=null;

        addBtn.textContent="Add Task";


    }

    else{


        todos.push(task);


    }



    saveTodos();

    clearForm();

    renderTodos();

}





// Clear Form


function clearForm(){

    todoInput.value="";

    categoryInput.value="";

    priorityInput.value="";

    statusInput.value="";

    startDateInput.value="";

    endDateInput.value="";

}




// Display Tasks



function renderTodos(){


    todoList.innerHTML="";



    let search =
    searchInput.value.toLowerCase();



    let filtered =
    todos.filter(todo=>

        todo.title
        .toLowerCase()
        .includes(search)

    );



    if(filtered.length===0){

        todoList.innerHTML=
        `
        <div class="empty-message">
        No tasks found 🚀
        </div>
        `;

        updateDashboard();

        return;

    }




    filtered.forEach(todo=>{


        let card =
        document.createElement("li");



        let statusClass =
        todo.status==="Completed"
        ?
        "completed"
        :
        todo.status==="In Progress"
        ?
        "progress"
        :
        "pending";



        card.innerHTML =


        `

        <div class="todo-card ${statusClass}">


        <h3>${todo.title}</h3>


        <p>
        Category:
        ${todo.category || "None"}
        </p>


        <p>
        Priority:
        ${todo.priority || "None"}
        </p>


        <p>
        Status:
        ${todo.status}
        </p>


        <p>
        Date:
        ${todo.startDate || "-"}
        →
        ${todo.endDate || "-"}
        </p>


        <div class="actions">


        <button 
        class="view"
        onclick="viewTodo(${todo.id})">

        View

        </button>



        <button
        class="edit"
        onclick="editTodo(${todo.id})">

        Edit

        </button>



        <button
        class="delete"
        onclick="deleteTodo(${todo.id})">

        Delete

        </button>


        </div>


        </div>


        `;


        todoList.appendChild(card);


    });



    updateDashboard();


}





// Edit Task



function editTodo(id){


    let todo =
    todos.find(
        t=>t.id===id
    );


    if(!todo)
    return;



    todoInput.value=todo.title;

    categoryInput.value=todo.category;

    priorityInput.value=todo.priority;

    statusInput.value=todo.status;

    startDateInput.value=todo.startDate;

    endDateInput.value=todo.endDate;



    editingId=id;


    addBtn.textContent=
    "Update Task";


}




// Delete Task


function deleteTodo(id){


    todos =
    todos.filter(
        t=>t.id!==id
    );


    saveTodos();


    renderTodos();


}




// Modal View



function viewTodo(id){


    let todo =
    todos.find(
        t=>t.id===id
    );


    todoDetails.innerHTML=


    `

    <h3>${todo.title}</h3>

    <p>
    Category:
    ${todo.category}
    </p>


    <p>
    Priority:
    ${todo.priority}
    </p>


    <p>
    Status:
    ${todo.status}
    </p>

    `;



    modal.style.display="flex";


}




function closeModal(){

    modal.style.display="none";

}





// Dashboard Statistics



function updateDashboard(){



    let total =
    todos.length;



    let completed =
    todos.filter(
        t=>t.status==="Completed"
    ).length;



    let pending =
    total-completed;



    totalTasksEl.innerText=total;

    completedTasksEl.innerText=completed;

    pendingTasksEl.innerText=pending;



    createCharts();

}






// Charts


function createCharts(){



    let statusData={

        Pending:0,

        "In Progress":0,

        Completed:0

    };



    let priorityData={


        High:0,

        Medium:0,

        Low:0


    };




    todos.forEach(todo=>{


        if(statusData[todo.status]!==undefined)

        statusData[todo.status]++;



        if(priorityData[todo.priority]!==undefined)

        priorityData[todo.priority]++;


    });






    if(statusChart)

    statusChart.destroy();



    if(priorityChart)

    priorityChart.destroy();




    statusChart =
    new Chart(

        document
        .getElementById("statusChart"),


        {

        type:"pie",

        data:{


            labels:
            Object.keys(statusData),


            datasets:[{

            data:
            Object.values(statusData)

            }]

        }

    });






    priorityChart =
    new Chart(

        document
        .getElementById("priorityChart"),


        {

        type:"pie",


        data:{


            labels:
            Object.keys(priorityData),


            datasets:[{


            data:
            Object.values(priorityData)


            }]

        }


    });



}





// Search



searchInput.addEventListener(
"input",
renderTodos
);



// Initial Load

renderTodos();