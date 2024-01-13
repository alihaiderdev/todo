let todos = [];
let selectedTodo = null;
let editTodoIndex;
const deletedTodosIndexes = [];

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");

const addTodoModalLabel = document.getElementById("addTodoModalLabel")
const addTodoButton = document.getElementById("add-todo-button");


window.onload = function () {
    // getValueFromLocalStorageAndSetIntoTodosArray();
    // showTodos();
    // showTodosCount();

    reRenderUI();
}

function showModal(addModal, index) {
    console.log({ addModal, index });
    if (addModal) {
        clearInputFields();
        addTodoModalLabel.textContent = "Add Todo";
        addTodoButton.textContent = "Add Todo";
        console.log({ addTodoModalLabel, addTodoButton });
    } else {
        const selectedEditTodo = todos[index]
        // console.log({ titleInput, descriptionInput, selectedEditTodo });
        titleInput.value = selectedEditTodo.title;
        descriptionInput.value = selectedEditTodo.description;
        addTodoModalLabel.textContent = "Edit Todo";
        addTodoButton.textContent = "Edit Todo";
        editTodoIndex = index;
    }
    const modal = new bootstrap.Modal(document.getElementById('add-todo-modal'));
    modal.show();
}

function editTodoItem(index) {
    todos[index]["title"] = titleInput.value;
    todos[index]["description"] = descriptionInput.value;
    setTodosToLocalStorage(todos);
    reRenderUI();
    console.log("edit Todo item: ", todos, index, titleInput.value, descriptionInput.value);
}

function onChangeSortOrder() {
    // Get the select element
    const selectElement = document.getElementById('todos-select-sort-order-vise');

    // Get the selected option
    const selectedOption = selectElement.options[selectElement.selectedIndex];

    // Get the value of the selected option
    const selectedValue = selectedOption.value;
    const copiedTodos = [...todos];
    console.log({ selectedValue, todos });
    if (selectedValue === "createdAt") {
        reRenderUI();
    } else if (selectedValue === "sortAToZ") {
        const sortAToZTodos = copiedTodos.sort((a, b) => a.title.localeCompare(b.title));
        // console.log({ sortAToZTodos });
        reRenderUI(false, sortAToZTodos);

    } else if (selectedValue === "sortZToA") {
        const sortZToATodos = copiedTodos.sort((a, b) => b.title.localeCompare(a.title));
        // console.log({ sortZToATodos });
        reRenderUI(false, sortZToATodos);

    }


}

function onChangeStatus() {
    // Get the select element
    const selectElement = document.getElementById('todos-select-status-vise');

    // Get the selected option
    const selectedOption = selectElement.options[selectElement.selectedIndex];

    // Get the value of the selected option
    const selectedValue = selectedOption.value;
    switch (selectedValue) {
        case "all":
            reRenderUI();
            break;
        case "done":
            const filteredDoneTodos = todos.filter((todo) => todo.isCompleted === true)
            // todos = filteredDoneTodos;
            reRenderUI(false, filteredDoneTodos);
            console.log(filteredDoneTodos);
            break;
        case "undone":
            const filteredUnDoneTodos = todos.filter((todo) => todo.isCompleted === false)
            // todos = filteredUnDoneTodos;
            reRenderUI(false, filteredUnDoneTodos);
            console.log(filteredUnDoneTodos);
            break;
        default:
            reRenderUI();
            break;
    }


}

function addTodo() {
    console.log({ deletedTodosIndexes });
    if (editTodoIndex) {
        // console.log("edit todo", editTodoIndex);
        editTodoItem(editTodoIndex);
    } else {
        // console.log("add todo", editTodoIndex);
        // const titleValue = document.getElementById("title")?.value;
        // const descriptionValue = document.getElementById("description")?.value;

        // titleInput.value = "";
        // descriptionInput.value = "";
        // OR

        if (!titleInput || !descriptionInput) {
            return;
        }
        const titleValue = titleInput?.value;
        const descriptionValue = descriptionInput.value;
        // if (titleInput === null || descriptionInput === null) {
        //     return
        // }
        // OR 

        if (!titleValue) {
            return alert("Title is required!");
        }
        // OR 
        // if (titleValue === "") {

        // }

        const todo = {
            title: titleValue,
            description: descriptionValue,
            // id: todos.length + 1,  // don't use this
            // id: Number((Math.random() * 1000).toFixed(0)),
            id: new Date().getTime(),
            // id: `${todos.length + 1}-${new Date().getTime()}`,
            isCompleted: false,
        };

        // use unshift array method here to add item at the beginning instead of end  
        todos.unshift(todo);

        // localStorage.setItem("todos", JSON.stringify(todos));
        setTodosToLocalStorage(todos);

        // console.log({
        //     // titleInput, descriptionInput,
        //     titleValue, descriptionValue, todo, todos
        // });
        // const ul = document.getElementById("todo-list");
        // var li = document.createElement("li");
        // li.innerHTML = todo;
        // ul.appendChild(li);
        // showTodos();
        // showTodosCount();

        reRenderUI();
        // titleInput.value = "";
        // descriptionInput.value = "";
        // OR 
        clearInputFields();
    }

}
// ${todo.isCompleted === true ? `<del><h3>${index + 1}: ${todo.title}</h3></del>` : `<h3>${index + 1}: ${todo.title}</h3>`}

{/* <div class="d-flex align-items-center">
<div class="form-check">
<input class="form-check-input" type="checkbox" onchange="markTodoAsDoneOrUndone(${index}, this)" checked="${todo.isCompleted}">
</div> 
<h3 style="${todo.isCompleted && "text-decoration: line-through;"}">${index + 1}: ${todo.title}</h3>
</div> */}
function showTodos(filteredTodos) {
    const ul = document.getElementById("todo-list");
    // console.log({ ul, todos });
    ul.innerHTML = "";
    if (todos.length > 0 || filteredTodos?.length > 0) {
        (filteredTodos || todos).forEach((todo, index) => {
            // console.log({ todo });
            const li = document.createElement("li");
            // <input class="form-check-input" type="checkbox" value="" checked>

            // const checkbox = document.createElement("input");
            // checkbox.setAttribute("type", "checkbox");
            // checkbox.classList.add("form-check-input");
            // checkbox.checked = todo.isCompleted;
            // const stringifyTodo = JSON.stringify(todo);
            li.innerHTML = `
            <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">   
            <div class="form-check">
            <input class="form-check-input checkbox" type="checkbox" onchange="pushSelectedTodoItemIndexInArray(${index},this)">
            </div> 
            <h3 style="${todo.isCompleted ? "text-decoration: line-through;" : ""}" class="m-0">${index + 1}: ${todo.title}</h3>
            </div>
            <div>
            <button class="btn btn-sm btn-success ${todo.isCompleted ? "done" : "undone"}" onclick="markTodoAsDoneOrUndone(${index}, this)">Mark as ${todo.isCompleted ? "undone" : "done"}</button>
            <button class="btn btn-sm btn-danger mx-2" onclick="deleteTodoItem(${index})">Delete</button>
            <button class="btn btn-sm btn-primary" onclick="showModal(false, ${index})">Edit</button>
            </div>
            </div>
            ${todo.description ? `<p>${todo.description}</p>` : ""}
        `;

            // const checkboxContainer = document.querySelector(".form-check");
            // console.log({ checkboxContainer });
            // if (checkboxContainer) {
            //     checkboxContainer.appendChild(checkbox);
            // }
            li.classList.add("shadow", "bg-body-tertiary", "rounded")
            // li.style.backgroundColor = todo.isCompleted ? "green" : "red";
            ul.appendChild(li);
        });
    } else {
        ul.innerHTML = "<h3>No todos found!</h3>";
    }

}

function pushSelectedTodoItemIndexInArray(index, currentCheckboxElement) {
    if (currentCheckboxElement.checked) {
        deletedTodosIndexes.push(index);
    }
    else {
        deletedTodosIndexes.splice(index, 1);
    }

    const deleteSelectedTodosButton = document.getElementById("deleteSelectedTodosBtn");
    if (deletedTodosIndexes.length > 0) {

        deleteSelectedTodosButton.textContent = `Delete Selected Todos (${deletedTodosIndexes.length})`
        deleteSelectedTodosButton.style.display = "block";

    } else {
        deleteSelectedTodosButton.style.display = "none";
    }
    console.log({ deletedTodosIndexes });

}


function markTodoAsDoneOrUndone(selectedIndex, button) {
    console.log("markTodoAsDoneOrUndone: ", selectedIndex,
        button
    );
    // let findTodo = todos.find((todo, index, items) => {
    //     console.log({ todo, index, items, title: todo.title, description: todo.description });
    //     if (index === selectedIndex) {
    //         return true;
    //     } else {
    //         return false
    //     }
    //     // OR 
    //     // return false;
    // })
    // // findTodo.isCompleted = true;
    // // OR 
    // // findTodo = { ...findTodo, isCompleted: true };

    // if (selectedCheckboxElement.checked) {
    //     console.log('Checkbox is checked');
    //     todos[selectedIndex]["isCompleted"] = true;
    // } else {
    //     console.log('Checkbox is unchecked');
    //     todos[selectedIndex]["isCompleted"] = false;
    // }

    if (button.classList.contains('undone')) {
        // console.log('The class "undone" exists on the element.');
        todos[selectedIndex]["isCompleted"] = true;
    } else {
        // console.log('The class "done" exist on the element.');
        todos[selectedIndex]["isCompleted"] = false;
    }

    setTodosToLocalStorage(todos);
    reRenderUI();
    // console.log({
    //     // findTodo,
    //     todos, selectedTodo: todos[selectedIndex]
    // });

}

function deleteTodoItem(index) {
    console.log("delete Todo item: ", index);

    const areYouSure = confirm(`Are you sure to delete todo item ${index + 1}?`);
    console.log({ areYouSure, todos });

    if (areYouSure) {
        todos.splice(index, 1);
        // localStorage.setItem("todos", JSON.stringify(todos));
        setTodosToLocalStorage(todos);
        // console.log({ todos });
        // getValueFromLocalStorageAndSetIntoTodosArray();
        // showTodos();
        // showTodosCount();
        reRenderUI();
    }
}

function deleteSelectedTodos() {
    const areYouSure = confirm(`Are you sure you want to delete all selected todos (${deletedTodosIndexes.length})?`);
    console.log({ areYouSure, todos });

    if (areYouSure) {
        // Remove items with specified index
        let remainingTodos = todos.filter((todo, index) => !deletedTodosIndexes.includes(index));
        setTodosToLocalStorage(remainingTodos);
        reRenderUI();
    }
}

function deleteAllTodos() {
    const areYouSure = confirm("Are you sure to delete all todos?");
    console.log({ areYouSure, todos });

    if (areYouSure) {
        localStorage.removeItem("todos");
        // console.log({ todos });
        // getValueFromLocalStorageAndSetIntoTodosArray();
        // showTodos();
        // showTodosCount();
        reRenderUI();
    }
}

function showTodosCount() {
    const todosCount = document.getElementById("todos-count");
    todosCount.innerHTML = `Total todos: (${todos.length})`;
}



function getValueFromLocalStorageAndSetIntoTodosArray() {
    const todosFromLocalStorage = localStorage.getItem("todos");
    // if (todosFromLocalStorage) {
    //     todos = JSON.parse(todosFromLocalStorage);
    // } else {
    //     todos = [];
    // }

    // OR  

    // console.log({ todosFromLocalStorage, parsedTodos: JSON.parse(todosFromLocalStorage) });

    todos = todosFromLocalStorage ? JSON.parse(todosFromLocalStorage) : [];
}

function reRenderUI(getValueFormLocalStorage = true, filteredTodos) {
    // console.log({ getValueFormLocalStorage });
    if (getValueFormLocalStorage) {
        getValueFromLocalStorageAndSetIntoTodosArray();
    }
    disabledDeleteAllTodosButton();
    showTodos(filteredTodos);
    showTodosCount();
}

function disabledDeleteAllTodosButton() {
    const deleteAllTodosBtn = document.getElementById("deleteAllTodosBtn")
    // console.log({ todos });
    if (todos.length === 0) {
        deleteAllTodosBtn.setAttribute("disabled", "disabled");
    } else {
        deleteAllTodosBtn.removeAttribute("disabled");
    }
}

function clearInputFields() {
    titleInput.value = "";
    descriptionInput.value = "";
}

function searchTodos() {
    const searchTodosInput = document.getElementById("search-todos-input")
    // console.log("searchTodos: ", searchTodosInput, searchTodosInput.value);
    const searchInputValue = searchTodosInput.value;
    if (searchInputValue) {
        console.log("value", todos);
        const filteredTodos = todos.filter((todo, index, items) => {
            console.log({ todo, index, items, title: todo.title, description: todo.description });
            const title = todo.title.toLowerCase().includes(searchInputValue.toLowerCase());
            const description = todo.description.toLowerCase().includes(searchInputValue.toLowerCase());

            if (title || description) {
                return true;
            }
            // else {
            //     return false
            // }
            // OR 
            return false;
        })

        todos = filteredTodos;
        // console.log({ filteredTodos, todos });
        // localStorage.setItem("todos", JSON.stringify(todos));
        // setTodosToLocalStorage(todos);
        reRenderUI(false);
    } else {
        reRenderUI();
    }
}

function setTodosToLocalStorage(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
}