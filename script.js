console.log("JavaScript Loaded!");

let button = document.getElementById("addBtn");

button.addEventListener("click", function() {
    let input = document.getElementById("taskInput");
    let task = input.value;

    if (task === "") {
        alert("Please enter a task.");
        return;
    }

    let li = document.createElement("li");
    li.textContent = task;

    document.getElementById("taskList").appendChild(li);

    input.value = "";
});