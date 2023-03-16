const electron = require("electron")
const { ipcRenderer } = electron

checkTodoCount()

const todoValue = document.querySelector("#todo-value")

ipcRenderer.on("initApp", (err, todos) => {
    todos.forEach(todo => {
        createTodoItemDom(todo)
    });
})

todoValue.addEventListener("keypress", (e) => {
    if(e.keyCode == 13){
        ipcRenderer.send("newTodo:save", {
            ref: "main",
            todoValue: e.target.value
        })
        todoValue.value = ""
    }
})

document.querySelector("#addBtn").addEventListener("click", () => {
    ipcRenderer.send("newTodo:save", {ref: "main", todoValue: todoValue.value})
    todoValue.value = ""
})

document.querySelector("#closeBtn").addEventListener("click", () => {
    if(confirm("Uygulamadan çıkmak istiyor musunuz?")){
        ipcRenderer.send("todo:close")
    }
})

ipcRenderer.on("todo:addItem", (e, todo) => {
    createTodoItemDom(todo)
})

function createTodoItemDom (todo) {
    // TodoList Container
    const container = document.querySelector(".todo-container")

    // Todo Item Row
    const todoItemRow = document.createElement("div")
    todoItemRow.className = "row"

    // Todo Item Col
    const todoItemCol = document.createElement("div")
    todoItemCol.className = "todo-item-col p-2 mb-3 text-light bg-dark col-md-12 shadow card d-flex justify-content-center flex-row align-items-center"
    //todoItemCol.style.backgroundColor = "#582E48 !important"

    // Todo Item p
    const p = document.createElement("p")
    p.className = "m-0 w-100"
    p.innerText = todo.text

    // Delete Button
    const deleteBtn = document.createElement("button")
    deleteBtn.className = "btn btn-sm btn-outline-danger flex-shrink-1"
    deleteBtn.innerText = "X"
    deleteBtn.setAttribute("data-id", todo.id)

    deleteBtn.addEventListener("click", (e) => {
        if(confirm("Bu kaydı silmek istediğinizden emin misiniz?")){
            ipcRenderer.send("todo:remove", e.target.getAttribute("data-id"))
            ipcRenderer.on("todo:delSuccess", (err, res) => {
                
                if(res){
                    e.target.parentNode.parentNode.remove()
                    checkTodoCount()
                }
            })
        }
    })

    // Update Button
    const updateBtn = document.createElement("button")
    updateBtn.className = "btn btn-sm btn-outline-warning flex-shrink-1 mr-1"
    updateBtn.innerText = "Düzenle"

    todoItemCol.appendChild(p)
    todoItemCol.appendChild(updateBtn)
    todoItemCol.appendChild(deleteBtn)

    todoItemRow.appendChild(todoItemCol)


    container.appendChild(todoItemRow)

    checkTodoCount()
}

function checkTodoCount(){
    const container = document.querySelector(".todo-container")
    const alertContainer = document.querySelector(".alert-container")

    document.querySelector(".total-count-container").innerText = container.children.length
    if(container.children.length !== 0){
        alertContainer.style.display = "none"
    } else {
        alertContainer.style.display = "block"
    }
}