const todo_Form = document.getElementById("todo_form");
const todo_Input = document.getElementById("todo_input");
const todo_Btn = document.getElementById("todo_btn");
const todo_Filter = document.getElementById("todo_filter")
const todo_Task = document.getElementById("todo_task")
const alert_Msg = document.getElementById("alert_msg");
let getData = JSON.parse(localStorage.getItem("task"))|| [];

// add list
function addTodo(e){
    e.preventDefault()
    if(todo_Input.value ===""){
        alert_Msg.classList.add("msg_show")
        setTimeout(()=>{
            alert_Msg.classList.remove("msg_show")
        },2000)
    }
    else{
        let color = ["#bc6c25","#ffb703","#f7b267","#00bbf9","#9b5de5","#ff99c8","#90a955"]
        let task = {
            complete:false,
            content:todo_Input.value,
            id:Math.floor(Math.random()*1000),
            color:color[Math.floor(Math.random()*color.length)]
        }
        getData.push(task);
        updatetodo(getData);
        todo_Input.value = "";
        todo_Filter.value = "All";
    }
}

//complete  todo
function completeTodo(item_id){
    getData.forEach(function(value){
        if(value.id === item_id){
            if(value.complete ===true){
                value.complete = false;
            }
            else{
                value.complete = true;
            }
        }
    })  
    updatetodo(getData);
}

//edit todo
function editTodo(item,item_id){
    children = item[0].children;

    for(let i=0;i<children.length;i++){
        if(children[i].id === "todo_edit"){
            let todo_Edit = children[i];
            todo_Edit.classList.remove("todo_edit_hide");
            todo_Edit.addEventListener("keydown",function(e){
                if(e.key === "Enter"){
                    todo_Edit.classList.add("todo_edit_hide");
                    getData.forEach(value=>value.id===item_id?value.content=todo_Edit.value:"");
                    localStorage.setItem("task",JSON.stringify(getData));
                    updatetodo(getData)
                }
            })
        }
    }
}

//delete todo
function deleteTodo(item_id){
    getData = getData.filter(value=>value.id!==item_id);
    updatetodo(getData);
}

//filter todo
function filterTodo(e){
    let status = e.target.value;
    const filter = document.querySelectorAll(".todo_item");

    for(let i=0;i<filter.length;i++){
        if(status === "Undone"){
            filter[i].style.display=(filter[i].className ==="todo_item")?"flex":"none";
        }
        else if(status ==="Done"){
            filter[i].style.display=(filter[i].className !=="todo_item")?"flex":"none";
        }
        else if(status ==="All"){
            filter[i].style.display="flex";
        }
    }
}

//update  todo
function updatetodo(getData){
    let data = "";

    for(let i=0;i<getData.length;i++){
    data +=
            `<div class="todo_item${getData[i].complete?" completed":""}" id="todo_item" data-index="${getData[i].id}" style="color:${getData[i].color}">
                <h3 class="todo_title">Task</h3>
                <p class="todo_content" id="todo_content">${getData[i].content}</p>
                <input type="text" id="todo_edit" class="todo_edit todo_edit_hide">
                <div class="todo_item_btn">
                    <button class="item_btn complete" id="btn-complete"><i class="fas fa-check complete" style="color:${getData[i].color}"></i></button>
                    <button class="item_btn edit" id="btn-edit"><i class="fas fa-pen edit" style="color:${getData[i].color}"></i></button>
                    <button class="item_btn delete" id="btn-delete"><i class="fas fa-trash-alt delete" style="color:${getData[i].color}"></i></button>
                </div>
            </div>
            `
    }
    todo_Task.innerHTML = data;
    data = "";
    localStorage.setItem("task",JSON.stringify(getData));
}
updatetodo(getData);


// Event listeners
todo_Form.addEventListener("submit",addTodo);
todo_Filter.addEventListener("click",filterTodo);

//list button Event listeners
todo_Task.addEventListener("click",function(e){
    let target = e.composedPath();
    let item = target.filter(value=>value.id === "todo_item");
    for(let i=0;i<target.length;i++){
        if(target[i].id === "btn-complete"){
            completeTodo(Number(item[0].dataset.index));
            todo_Filter.value = "All";
        }
        else if(target[i].id === "btn-edit"){
            editTodo(item,Number(item[0].dataset.index));
        }
        else if(target[i].id === "btn-delete"){
            deleteTodo(Number(item[0].dataset.index));
        }
    }
})