//declaring and initializing four variables using the const keyword. taskInput, filters, clearAll, and taskBox are all variables that store references to HTML elements that we will use later in the code. The document.querySelector() method is used to select elements on the page. //

const taskInput = document.querySelector(".task-input input"),
  filters = document.querySelectorAll(".filters span"),
  clearAll = document.querySelector(".clear-btn"),
  taskBox = document.querySelector(".task-box");

//In this code block, we declare and initialize three variables using the let keyword. editId, isEditTask, and todos are all variables that will be used later in the code. The localStorage.getItem() method retrieves data from local storage, and the JSON.parse() method is used to parse the retrieved data into a JavaScript object.//

let editId,
  isEditTask = false,
  todos = JSON.parse(localStorage.getItem("todo-list"));

//In this code block, we use a forEach loop to add an event listener to each element in the filters array. When a filter is clicked, we remove the active class from any element that has it, add the active class to the clicked element, and call the showTodo() function with the ID of the clicked element.//

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showTodo(filter) {
  let liTag = "";

  // The function first checks if there are any saved todos in the local storage by checking the truthiness of the todos variable. todos is set to the parsed JSON value of the "todo-list" key in the local storage using JSON.parse(localStorage.getItem("todo-list")).
  if (todos) {
    // If there are todos saved, a forEach loop is used to iterate over each todo item. The forEach function takes a callback function with two parameters - todo and id. The id represents the index of the todo item in the todos array.
    todos.forEach((todo, id) => {
      // Inside the loop, a variable completed is declared and assigned a value of "checked" if the todo's status is "completed". This variable will be used to add the "checked" attribute to the todo's input element if the status is "completed".
      let completed = todo.status == "completed" ? "checked" : "";

      // The loop also checks if the filter parameter matches the todo's status or if filter is set to "all". If there's a match, a string of HTML is constructed using template literals with the todo's name and status. The liTag variable is then updated by appending the constructed HTML string.
      if (filter == todo.status || filter == "all") {
        // After the loop is done iterating over all the todos, the liTag variable is inserted into the .task-box element using taskBox.innerHTML = liTag. If there are no todos, a string is constructed to indicate that there are no tasks, and that string is inserted into the .task-box element.
        liTag += `<li class="task">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                        <p class="${completed}">${todo.name}</p>
                    </label>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="task-menu">
                            <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                            <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                        </ul>
                    </div>
                </li>`;
      }
    });
  }

  // The function also updates the .clear-btn element's visibility based on whether there are any tasks or not, and sets the overflow class on the .task-box element if the height of the element is more than or equal to 300 pixels.
  taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
  let checkTask = taskBox.querySelectorAll(".task");
  !checkTask.length
    ? clearAll.classList.remove("active")
    : clearAll.classList.add("active");
  taskBox.offsetHeight >= 300
    ? taskBox.classList.add("overflow")
    : taskBox.classList.remove("overflow");
}

// Finally, the showTodo function is called with the argument "all" to display all todos by default when the page loads. The showTodo function is defined with a single parameter filter. Inside the function, an empty string variable liTag is declared.

showTodo("all");

//The function showMenu(selectedTask) takes a parameter selectedTask which is an HTML element. It gets the last child of the parent element of selectedTask and adds the class show to it. It also adds a click event listener to the document. If the user clicks anywhere outside of the menu or the selectedTask element, the show class is removed from the menu.

function showMenu(selectedTask) {
  let menuDiv = selectedTask.parentElement.lastElementChild;
  menuDiv.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != selectedTask) {
      menuDiv.classList.remove("show");
    }
  });
}

//The function updateStatus(selectedTask) takes a parameter selectedTask which is a checkbox HTML element. It gets the last child of the parent element of selectedTask and toggles the class checked. It also updates the status of the corresponding task in the todos array to either "completed" or "pending", depending on whether the checkbox is checked or unchecked. Finally, it saves the updated todos array in the local storage.

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

//The function editTask(taskId, textName) takes two parameters, taskId and textName. It sets the global variable editId to the value of taskId, sets the global variable isEditTask to true, sets the value of the taskInput HTML element to textName, focuses on the taskInput element, and adds the class active to it.

function editTask(taskId, textName) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = textName;
  taskInput.focus();
  taskInput.classList.add("active");
}

//The function deleteTask(deleteId, filter) takes two parameters, deleteId and filter. It sets the global variable isEditTask to false, removes the task at index deleteId from the todos array, saves the updated todos array in the local storage, and calls the showTodo(filter) function to update the display of the todo list.

function deleteTask(deleteId, filter) {
  isEditTask = false;
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo(filter);
}

//This code block adds a click event listener to the clearAll HTML element. When clicked, it sets the global variable isEditTask to false, removes all tasks from the todos array, saves the updated todos array in the local storage, and calls the showTodo() function to update the display of the todo list.

clearAll.addEventListener("click", () => {
  isEditTask = false;
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
});

//This code block adds a keyup event listener to the taskInput HTML element. When the user presses the Enter key and the value of taskInput is not empty, it either adds a new task to the todos array or updates an existing task in the todos array, depending on whether the global variable isEditTask is true or false. It then clears the taskInput value, saves the updated todos array in the local storage, and calls the showTodo() function to update the display of the todo list.

taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    if (!isEditTask) {
      todos = !todos ? [] : todos;
      let taskInfo = { name: userTask, status: "pending" };
      todos.push(taskInfo);
    } else {
      isEditTask = false;
      todos[editId].name = userTask;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(document.querySelector("span.active").id);
  }
});
