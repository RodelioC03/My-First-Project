console.log("JavaScript Loaded!");
function addTask() {

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
}
let li = document.createElement("li");
li.textContent = task;

document.getElementById("taskList").appendChild(li);
let li = document.createElement("li");
li.textContent = task;

document.getElementById("taskList").appendChild(li);
li.addEventListener("click", function() {
    li.style.textDecoration = "line-through";
});