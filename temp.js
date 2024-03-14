import Kanban from "./kanban.js";


const todo = document.querySelector(".cards.todo");
const progress = document.querySelector(".cards.progress");
const complete = document.querySelector(".cards.completed");

const taskBox = [todo, progress, complete];
console.log(taskBox[1])

function addTaskCard(task, index){
    const element = document.createElement("form");
    element.className = "card";
    element.draggable = true;
    element.dataset.id = task.taskBox;
    element.innerHTML = ` 
            <input
            type="text"
            name="task"
            autocomplete="off"
            disabled="disabled"
            value="${task.content}"
        />
        <div>
            <span class="task-id">#${task.taskId}</span>
            <span>
            <button class="bi bi-pencil edit" data-id="${task.taskId}" data-column="${index}"></button>
            <button
                class="bi bi-check-lg update hide"
                data-id="${task.taskId}"
                data-column="${index}"
            ></button>
            <button class="bi bi-trash3 delete" data-id="${task.taskId}" data-column="${index}"></button>
            </span>
        </div>
  `;
  taskBox[index].appendChild(element);
}

Kanban.getAllTasks().forEach((tasks, index) => {
    tasks.forEach(task =>{
        addTaskCard(task, index)
    })
})

const addForm = document.querySelectorAll(".add");
addForm.forEach(form => {
    form.addEventListener("submit", event =>{
        event.preventDefault();
        if(form.task.value){
            const task = Kanban.insertTaks(form.submit.dataset.id, form.task.value.trim());
            console.log(task)
            addTaskCard(task, form.submit.dataset.id);
            form.reset();
        }
    })
})

taskBox.forEach(column => {
    column.addEventListener("click", event => {
        event.preventDefault();
        const formInput = event.target.parentElement.parentElement.previousElementSibling;
        if(event.target.classList.contains("edit")){
            formInput.removeAttribute("disabled");
            event.target.classList.add("hide");
            event.target.nextElementSibling.classList.remove("hide")
        }
        if(event.target.classList.contains("update")){
            console.log("dfa")
            formInput.setAttribute("disabled","disabled");
            event.target.previousElementSibling.classList.remove("hide");
            event.target.classList.add("hide");


            const taskId = event.target.dataset.id;
            const columnId = event.target.dataset.column;
            const content = formInput.value;
            console.log(taskId, columnId, content)
            Kanban.updataTask(taskId, {
                columnId: columnId,
                content : content
            });
        }

        if(event.target.classList.contains("delete")){
            const taskId = event.target.dataset.id;
            formInput.parentElement.remove();
            Kanban.deleteTask(taskId);
        }
    });

    column.addEventListener("dragstart", event =>{
        if(event.target.classList.contains("card")){
            event.target.classList.add("dragging");
            
        }
    });

    column.addEventListener("dragover", event => {
        const todo = document.querySelector("span.todo");
    
        const pending = document.querySelector("span.pending");

        const completed = document.querySelector("span.completed");

        try {
            const card = document.querySelector(".dragging");
            column.appendChild(card);    
        } catch (error) {
            console.log(error)
        }finally{
            const card = document.querySelector(".dragging");
            column.appendChild(card); 
        }
        
    });

    column.addEventListener("dragend", event =>{
        if(event.target.classList.contains("card")){
            // event.target.classList.remove("dragging");

            const taskData = event.target.innerText;
            
            const taskId = taskData.slice(1,taskData.length)
            
            const columnId = event.target.parentElement.dataset.id;
            const content = event.target.task.value;
            
           

            Kanban.updataTask(taskId, {
                columnId : columnId,
                content: content
            });
            
        }
    })



})

