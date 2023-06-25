// Load tasks from local storage if available
var tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];

// Function to save tasks to local storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to add a new task
function addTask(title, description, priority) {
  // Create a new task object
  var task = {
    title: title,
    description: description,
    priority: priority
  };

  // Add the task to the tasks array
  tasks.push(task);

  // Save the updated tasks to local storage
  saveTasks();

  // Render the task on the task list
  renderTask(task);
}

// Function to remove a task from local storage
function removeFromLocalStorage(task) {
  var index = tasks.indexOf(task);
  if (index !== -1) {
    tasks.splice(index, 1);
    saveTasks();
  }
}

// Function to render a task on the task list
function renderTask(task) {
  var taskElement = document.createElement("li");
  taskElement.classList.add("mb-2","task-item"); // Add a margin-bottom class to create a gap

  var taskTitleButton = document.createElement("button");
  taskTitleButton.type = "button";
  taskTitleButton.classList.add("btn", "col-12", "text-start", "ms-0");
  taskTitleButton.setAttribute("data-bs-toggle", "modal");
  taskTitleButton.setAttribute("data-bs-target", "#exampleModal");
  taskTitleButton.innerHTML = task.title;

  taskTitleButton.addEventListener("click", function () {
    var modalTitleElement = document.getElementById("exampleModalLabel");
    var modalDescriptionElement = document.getElementById("taskDescription");
    modalTitleElement.innerText = task.title;
    modalDescriptionElement.innerText = task.description;
  });

   // Add a hover effect with a zoom effect
   taskElement.addEventListener("mouseover", function () {
    taskElement.classList.add("task-item-hover");
  });

  taskElement.addEventListener("mouseout", function () {
    taskElement.classList.remove("task-item-hover");
  });


  var deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.classList.add("btn", "btn-danger", "deleteTask");
  deleteButton.innerText = "Remove";

  deleteButton.addEventListener("click", function () {
    taskElement.remove();
    removeFromLocalStorage(task);
  });

  var taskTitleColumn = document.createElement("div");
  taskTitleColumn.classList.add("col-8", "border", "align-middle", "p-0");
  taskTitleColumn.appendChild(taskTitleButton);

  var deleteButtonColumn = document.createElement("div");
  deleteButtonColumn.classList.add("col-4");
  deleteButtonColumn.appendChild(deleteButton);

  var taskRow = document.createElement("div");
  taskRow.classList.add("row", "ms-2");
  taskRow.appendChild(taskTitleColumn);
  taskRow.appendChild(deleteButtonColumn);

  taskElement.appendChild(taskRow);

  // Check if the task has top priority
  if (task.priority) {
    // Insert the task at the top of the task list
    var taskList = document.getElementById("taskList");
    taskList.insertBefore(taskElement, taskList.firstChild);
  } else {
    // Append the task element to the task list
    document.getElementById("taskList").appendChild(taskElement);
  }
}

// Add an event listener to the form's submit event
document.getElementById("addTaskForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the input values
  var title = document.getElementById("exampleInputTitle").value.trim();
  var description = document.getElementById("floatingTextarea2").value.trim();
  var priority = document.getElementById("exampleCheck1").checked;

  // Validate the input values
  if (isEmptyOrWhitespace(title) || isEmptyOrWhitespace(description)) {
    // Show a warning if either title or description is empty
    alert("Please fill in both the title and description fields.");
    return; // Stop further execution
  }

  // Add the task
  addTask(title, description, priority);

  // Reset the form fields
  document.getElementById("exampleInputTitle").value = "";
  document.getElementById("floatingTextarea2").value = "";
  document.getElementById("exampleCheck1").checked = false;
});

// Add an event listener to the task list for the delete button clicks
document.getElementById("taskList").addEventListener("click", function (event) {
  if (event.target.classList.contains("deleteTask")) {
    var listItem = event.target.closest("li");
    listItem.remove();

    // Get the task object associated with the task element
    var task = tasks.find(function (task) {
      return task.title === listItem.querySelector("button").innerText;
    });

    // Remove the task from local storage
    removeFromLocalStorage(task);
  }
});

// Helper function to check if a string is empty or contains only whitespace
function isEmptyOrWhitespace(str) {
  return str === null || str.match(/^ *$/) !== null;
}

// Render the tasks from local storage on page load
function renderTasksFromStorage() {
  tasks.forEach(function (task) {
    renderTask(task);
  });
}

renderTasksFromStorage();
