const taskList = document.getElementById("taskList");
const dueDateInput = document.getElementById("dueDate");
const priorityInput = document.getElementById("priority");
const submitBtn = document.getElementById("submitBtn");
const editTaskBtn = document.getElementById("editTask");
const tasksHeading = document.getElementById("heading-tasks");
const searchBar = document.getElementById("searchBar");
const modeToggleBtn = document.getElementById("modeToggle");
const checkboxes = document.querySelectorAll(".form-check-input");
let editItem = null;
const tasksWithPriority = [];
let tasksTitleArray = [];
const priorityColors = {
  High: "task-priority-High",
  Medium: "task-priority-Medium",
  Low: "task-priority-Low",
  Completed: "task-completed",
};

const priorityValues = {
  High: 3,
  Medium: 2,
  Low: 1,
};

 editTaskBtn.addEventListener("click", (e) => {
  handleEditClick(e);
});
submitBtn.addEventListener("click", (e) => {
  addItem(e);
});
taskList.addEventListener("click", handleItemClick);
modeToggleBtn.addEventListener("click", toggleMode);
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", markAsComplete);
});

flatpickr(dueDateInput, {
  enableTime: false,
  dateFormat: "Y-m-d",
});

 function init() {
  const searchBar = document.getElementById("searchBar");
  searchBar.addEventListener("input", handleSearch);
  loadTasksFromLocalStorage();
  tasksCheck();
}

 function handleSearch() {
  const searchTerm = searchBar.value.toLowerCase();
  const tasks = document.querySelectorAll(".list-group-item");
  tasks.forEach((task) => {
    const taskTitle = task.childNodes[1].textContent.trim().toLowerCase();
    if (taskTitle.includes(searchTerm)) {
      task.style.display = "block";
    } else {
      task.style.display = "none";
    }
  });
}

 function tasksCheck() {
  const tasks = taskList.children;
  if (tasks.length === 0) {
    tasksHeading.classList.toggle("hidden");
    searchBar.classList.toggle("hidden");
    document.querySelector(".clear_btn").style.display = "none";
    document.querySelector(".dropdown").style.display = "none";
  }
}

 function handleEditItem(e) {
  e.preventDefault();
  editTaskBtn.style.display = "inline";
  submitBtn.style.display = "none";
  const taskTitle = e.target.parentElement.childNodes[1].textContent.trim();
  console.log(e.target.parentElement.childNodes);
  const taskDescription = e.target.parentElement.childNodes[4].textContent
    .trim()
    .replace("Description:", "");
  document.getElementById("item").value = taskTitle;
  document.getElementById("description").value = taskDescription;
  document.getElementById("maintitle").innerText = "Edit your tasks below :";
  editItem = e.target;
  document.documentElement.scrollTop = 0;
  document.getElementById("item").focus();
}

 function handleEditClick(e) {
  e.preventDefault();
  const itemInput = document.getElementById("item");
  const dueDateInput = document.getElementById("dueDate");
  const descriptionInput = document.getElementById("description");
  const editedItemText = itemInput.value;
  const editedDescriptionText = descriptionInput.value;
  const editedDueDate = new Date(dueDateInput.value);
  const currentDate = new Date().toISOString().split("T")[0];
  const editedPriority = document.getElementById("priority").value;

   if (!editedItemText.trim()) {
    displayErrorMessage("Task not entered");
    return false;
  }

  if (!editedItemText) {
    displayErrorMessage("Title must not be empty!!!.");
    return false;
  }

  if (editedDueDate < new Date(currentDate)) {
    displayErrorMessage("Due date has already passed !!!");
    return false;
  }

  if (!editedPriority) {
    displayErrorMessage("Please select priority");
    return false;
  }
 
   const listItem = editItem.parentElement;
  listItem.childNodes[1].textContent = editedItemText;
  listItem.childNodes[4].textContent = editedDescriptionText.trim()
    ? "Description: " + editedDescriptionText
    : "";
  listItem.childNodes[7].textContent = editedPriority;
  if (editedDueDate >= new Date(currentDate)) {
    listItem.childNodes[6].textContent = `Due Date:${dueDateInput.value}`;
  }
  const capitalizedPriority =
    editedPriority.charAt(0).toUpperCase() +
    editedPriority.slice(1).toLowerCase();
  listItem.className = `list-group-item card shadow mb-4 bg-transparent ${priorityColors[capitalizedPriority]}`;
  displaySuccessMessage("Task edited successfully !!!");
  editItem = null;
  itemInput.value = "";
  descriptionInput.value = "";
  dueDateInput.value = "";
  document.getElementById("maintitle").innerText = "Add your tasks below :";
  editTaskBtn.style.display = "none";
  submitBtn.style.display = "inline";
  saveTasksToLocalStorage();
}

 function displayTaskDetails(taskElement) {
  if (taskElement) {
    const dueDateElement = taskElement.querySelector("#task-dueDate");
    const priorityElement = taskElement.querySelector("#task-priority");
    const dueDate = dueDateElement
      ? dueDateElement.textContent.split(":")[1].trim()
      : null;
    const priority = priorityElement
      ? priorityElement.textContent.trim()
      : null;
    console.log(`Task Details - Due Date: ${dueDate}, Priority: ${priority}`);
  }
}

function showComfirmboxForDuplicateTasks() {
  const confirmationBox = document.getElementById("duplicate-task");

   delalert_title = document.getElementById("duplicate-msg");
  delalert_title.innerHTML = "&#9888; This task is already present";
  delalert_title.className = "alert alert-danger";
  delalert_title.role = "alert";

  const confirmYesButton = document.getElementById("duplicate-ok");
  const confirmCancelButton = document.getElementById("duplicate-cancel");

   const handleYesClick = () => {
    confirmationBox.style.display = "none";
    confirmYesButton.removeEventListener("click", handleYesClick);
    confirmCancelButton.removeEventListener("click", handleCancelClick);
  };

  const handleCancelClick = () => {
    confirmationBox.style.display = "none";
    confirmYesButton.removeEventListener("click", handleYesClick);
    confirmCancelButton.removeEventListener("click", handleCancelClick);
  };

  confirmYesButton.addEventListener("click", handleYesClick);
  confirmCancelButton.addEventListener("click", handleCancelClick);

  confirmationBox.style.display = "flex";
}

 function addItem(e) {
  e.preventDefault();
  tasksCheck();
  const newTaskTitle = document.getElementById("item").value;
  const description = document.getElementById("description").value;
  let dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;

   const currentDate = new Date();
  const dueDateObj = new Date(dueDate);

   if (checkForDuplicateTasks(newTaskTitle)) {
    showComfirmboxForDuplicateTasks();
    return false;
  }

  let isDescritionPresent = description.trim() === "" ? false : true;

   if (!newTaskTitle) {
    displayErrorMessage("Task Title should be filled!!!");
    tasksHeading.classList.add("hidden");
    searchBar.classList.add("hidden");
    return false;
  } else if (!dueDate) {
    displayErrorMessage("Please specify a due date !!!");
    return false;
  } else if (dueDateObj < currentDate) {
    displayErrorMessage("Due date has already passed !!!");
    return false;
  } else {
    tasksHeading.classList.remove("hidden");
    searchBar.classList.remove("hidden");
  }

  if (newTaskTitle.trim() === "") return false;
  else {
    document.getElementById("item").value = "";
    document.querySelector(".clear_btn").style.display = "inline";
    document.querySelector(".dropdown").style.display = "inline";
  }
  const creationDateTime = new Date().toLocaleString();
  createNewTask(
    newTaskTitle,
    creationDateTime,
    dueDate,
    priority,
    description,
    isDescritionPresent
  );
  saveTasksToLocalStorage();

   document.getElementById("dueDate").value = "";
  document.getElementById("description").value = "";
  document.getElementById("priority").value = "";
}

 function checkForDuplicateTasks(newTaskTitle) {
  var taskList = document.getElementById("taskList");
  var listItems = taskList.querySelectorAll("li");
  var textArray = [];

  listItems.forEach(function (li) {
     var textContent = li.textContent.trim();
     textArray.push(textContent);
  });
  TitleArray = textArray.map(function (element) {
     var match = element.match(/^(.*?)Description/);
     return match ? match[1] : null;
  });
  let isnewTitlepresent = TitleArray.includes(newTaskTitle);
  return isnewTitlepresent;
}

 function handleItemClick(e) {
  if (e.target.classList.contains("delete")) {
    e.preventDefault();
    const li = e.target.parentElement;
    const confirmationBox = document.getElementById("custom-confirm");

     delalert_title = document.getElementById("confirm-msg");
    delalert_title.innerHTML =
      "&#9888; Are you sure you want to delete this task?";
    delalert_title.className = "alert alert-danger";
    delalert_title.role = "alert";

    const confirmYesButton = document.getElementById("confirm-yes");
    const confirmNoButton = document.getElementById("confirm-no");
    const confirmCancelButton = document.getElementById("confirm-cancel");

     const handleYesClick = () => {
      confirmationBox.style.display = "none";
      li.parentElement.removeChild(li);
      tasksCheck();
      displaySuccessMessage("Task deleted successfully !!!");
      saveTasksToLocalStorage();
      confirmYesButton.removeEventListener("click", handleYesClick);
      confirmNoButton.removeEventListener("click", handleNoClick);
      confirmCancelButton.removeEventListener("click", handleCancelClick);
    };

    const handleNoClick = () => {
      confirmationBox.style.display = "none";
      confirmYesButton.removeEventListener("click", handleYesClick);
      confirmNoButton.removeEventListener("click", handleNoClick);
      confirmCancelButton.removeEventListener("click", handleCancelClick);
    };

    const handleCancelClick = () => {
      confirmationBox.style.display = "none";
      confirmYesButton.removeEventListener("click", handleYesClick);
      confirmNoButton.removeEventListener("click", handleNoClick);
      confirmCancelButton.removeEventListener("click", handleCancelClick);
    };

    confirmYesButton.addEventListener("click", handleYesClick);
    confirmNoButton.addEventListener("click", handleNoClick);
    confirmCancelButton.addEventListener("click", handleCancelClick);

    confirmationBox.style.display = "flex";
  }
  saveTasksToLocalStorage();
}

function markAsComplete(e) {
  const li = e.target.parentElement;
  const originalClassList = li.dataset.originalClassList;
  const editButton = li.querySelector(".edit");
   if (editButton)
    editButton.style.display =
      editButton.style.display === "none" ? "block" : "none";
   if (originalClassList) {
    li.className = originalClassList;
    li.removeAttribute("data-original-class-list");
  } else {
     li.dataset.originalClassList = li.className;
    li.classList.toggle("task-completed");
  }
}

 function displaySuccessMessage(message) {
  document.getElementById("lblsuccess").innerHTML = message;
  document.getElementById("lblsuccess").style.display = "block";
  setTimeout(function () {
    document.getElementById("lblsuccess").style.display = "none";
  }, 3000);
}

 function displayErrorMessage(message) {
  document.getElementById("lblerror").innerHTML = message;
  document.getElementById("lblerror").style.display = "block";
  setTimeout(function () {
    document.getElementById("lblerror").style.display = "none";
  }, 3000);
}

 function saveTasksToLocalStorage() {
  const tasks = document.querySelectorAll(".list-group-item");
  const tasksArray = extractTasksData(tasks);
  storeTasksInLocalStorage(tasksArray);
}

 function extractTasksData(tasks) {
  return Array.from(tasks).map((task) => {
    const taskText = task.childNodes[1].textContent;
    const isCompleted = task.classList.contains("completed");
    const createdAt = task.querySelector("#created-at").textContent;
    const description = task.querySelector("#description-at")
      ? task.querySelector("#description-at").textContent
      : "";
    const dueDate = task.querySelector("#task-dueDate").textContent;
    const priority = task.querySelector("#task-priority").textContent;

    return createTaskObject(
      taskText,
      isCompleted,
      createdAt,
      dueDate,
      priority,
      description
    );
  });
}

 function createTaskObject(
  text,
  completed,
  createdAt,
  dueDate,
  priority,
  description
) {
  return {
    text,
    completed,
    createdAt,
    dueDate,
    priority,
    description,
  };
}

 function storeTasksInLocalStorage(tasksArray) {
  localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

 function getTasksFromLocalStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

 function loadTasksFromLocalStorage() {
  const tasks = getTasksFromLocalStorage();
  const clearButton = document.querySelector(".clear_btn");
  const dropdown = document.querySelector(".dropdown");

  if (tasks.length > 0) {
    tasksHeading.classList.remove("hidden");
    searchBar.classList.remove("hidden");
    clearButton.style.display = "inline";
    dropdown.style.display = "inline";

    tasks.forEach((task) => {
      displayTask(task);
    });
  }
}

 function displayTask(task) {
  createNewTask(
    task.text,
    task.createdAt.slice(8),
    task.dueDate.split(":")[1],
    task.priority,
    task.description.slice(12)
  );
}

 function enableSubmit(ref, btnID) {
  document.getElementById(btnID).disabled = false;
}

 function toggleMode() {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
  if (modeToggleBtn.checked === true) {
    localStorage.setItem("dark-mode", "enabled");
  } else {
    localStorage.setItem("dark-mode", null);
  }
}

 function clearAllTasks() {
  const taskList = document.getElementById("taskList"); // Replace with your actual task list ID
  const confirmationBoxAll = document.getElementById("custom-confirm-all");
  const alertTitle = document.getElementById("confirm-msg-all");
  const confirmYesButtonAll = document.getElementById("confirm-yes-all");
  const confirmNoButtonAll = document.getElementById("confirm-no-all");
  const confirmCancelButtonAll = document.getElementById("confirm-cancel-all");

  if (taskList.children.length > 0) {
    alertTitle.innerHTML = "&#9888; Are you sure you want to delete all tasks?";
    alertTitle.className = "alert alert-danger";
    alertTitle.role = "alert";

    confirmYesButtonAll.addEventListener("click", () => {
      confirmationBoxAll.style.display = "none";
      while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
      }
      document.querySelector(".clear_btn").style.display = "none";
      document.querySelector(".dropdown").style.display = "none";
      tasksHeading.classList.add("hidden");
      searchBar.classList.add("hidden");
      localStorage.clear();

     });

    confirmNoButtonAll.addEventListener("click", () => {
      confirmationBoxAll.style.display = "none";
    });

    confirmCancelButtonAll.addEventListener("click", () => {
      confirmationBoxAll.style.display = "none";
    });

    confirmationBoxAll.style.display = "flex";
  } else {
   }
}

 function sortByDueDate(order) {
  const sortTaskList = JSON.parse(localStorage.getItem("tasks"));

  if (order === "early") {
    sortTaskList.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else if (order === "late") {
    sortTaskList.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  }

  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  tasksHeading.classList.add("hidden");
  searchBar.classList.add("hidden");
  localStorage.setItem("tasks", JSON.stringify(sortTaskList));
  loadTasksFromLocalStorage();
}

 function sortByPriority(order) {
  const sortTaskList = JSON.parse(localStorage.getItem("tasks"));

  sortTaskList.sort((a, b) => {
    if (order === "highToLow") {
      return priorityValues[b.priority] - priorityValues[a.priority];
    } else if (order === "lowToHigh") {
      return priorityValues[a.priority] - priorityValues[b.priority];
    } else {
      return 0;
    }
  });

  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  tasksHeading.classList.add("hidden");
  searchBar.classList.add("hidden");
  localStorage.setItem("tasks", JSON.stringify(sortTaskList));
  loadTasksFromLocalStorage();
}

 function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

 window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

 function createNewTask(
  taskTitle,
  createdDate,
  dueDate,
  priority,
  description,
  isDescritionPresent
) {
  const li = document.createElement("li");
  li.className = `list-group-item card shadow mb-4 bg-transparent ${priorityColors[priority]}`;
  const completeCheckbox = document.createElement("input");
  completeCheckbox.type = "checkbox";
  completeCheckbox.className = "form-check-input task-completed";
  completeCheckbox.addEventListener("change", markAsComplete);
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "btn btn-outline-danger float-right delete";
  deleteButton.innerHTML =
    '<ion-icon name="trash-outline" style="font-size: 20px"></ion-icon>';
  deleteButton.style.paddingTop = "10px";
  deleteButton.style.PaddingRight = "10px";

  const editButton = document.createElement("button");
  editButton.className = "btn btn-outline-secondary btn-sm float-right edit";
  editButton.innerHTML =
    '<ion-icon name="create-outline" style="font-size: 20px"></ion-icon>';
  editButton.style.marginRight = "8px";
  editButton.style.paddingTop = "10px";
  editButton.style.PaddingRight = "10px";
  editButton.addEventListener("click", function (e) {
    handleEditItem(e);
  });

  const descriptionParagraph = document.createElement("p");
  if (isDescritionPresent === true) {
    descriptionParagraph.className = "text-muted";
    descriptionParagraph.id = "description-at";
    descriptionParagraph.style.fontSize = "15px";
    descriptionParagraph.style.margin = "0 19px";
    descriptionParagraph.appendChild(
      document.createTextNode("Description: " + description)
    );
  }

  const dateTimeParagraph = document.createElement("p");
  dateTimeParagraph.className = "text-muted";
  dateTimeParagraph.id = "created-at";
  dateTimeParagraph.style.fontSize = "15px";
  dateTimeParagraph.style.margin = "0 19px";
  dateTimeParagraph.appendChild(
    document.createTextNode("Created: " + createdDate)
  );

  const dueDateParagraph = document.createElement("p");
  dueDateParagraph.className = "text-muted";
  dueDateParagraph.id = "task-dueDate";
  dueDateParagraph.style.fontSize = "15px";
  dueDateParagraph.style.margin = "0 19px";
  dueDateParagraph.appendChild(document.createTextNode("Due Date: " + dueDate));

  const priorityParagraph = document.createElement("p");
  priorityParagraph.className = "text-muted";
  priorityParagraph.id = "task-priority";
  priorityParagraph.style.fontSize = "15px";
  priorityParagraph.style.margin = "0 19px";
  priorityParagraph.appendChild(document.createTextNode(priority));

  li.appendChild(completeCheckbox);
  li.appendChild(document.createTextNode(taskTitle));
  li.appendChild(deleteButton);
  li.appendChild(editButton);
  li.appendChild(descriptionParagraph);
  li.appendChild(dateTimeParagraph);
  li.appendChild(dueDateParagraph);
  li.appendChild(priorityParagraph);

  taskList.appendChild(li);
  displayTaskDetails(li);
}

 document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    document.querySelector(".preloader").style.display = "none";
  }, 2000);
});

 document.addEventListener("DOMContentLoaded", function () {
  const headerText = "To-Do List Application";
  const headerElement = document.getElementById("todo-header");

  function typeText(text, index) {
    headerElement.textContent = text.slice(0, index);

    if (index < text.length) {
      setTimeout(function () {
        typeText(text, index + 1);
      }, 50);
    }
  }

  typeText(headerText, 0);
});

 function themeSwitcher() {
  if (localStorage.length === 0) {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    if (prefersDarkScheme.matches) {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("dark-mode", "enabled");
      modeToggleBtn.checked = true;
    } else {
      document.body.classList.toggle("light-mode");
      localStorage.setItem("dark-mode", null);
    }
  } else {
    if (localStorage.getItem("dark-mode") === "enabled") {
      document.body.classList.toggle("dark-mode");
      modeToggleBtn.checked = true;
    } else {
      document.body.classList.toggle("light-mode");
    }
  }
}
themeSwitcher();
