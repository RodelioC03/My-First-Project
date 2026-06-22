console.log("JavaScript Loaded!");

document.getElementById("addBtn").addEventListener("click", function() {
    let taskInput = document.getElementById("taskInput");
    let deadlineInput = document.getElementById("deadlineInput");

    let task = taskInput.value;
    let deadline = new Date(deadlineInput.value);

    if (task === "" || deadlineInput.value === "") {
        alert("Please enter a task and deadline.");
        return;
    }

    let threeDaysBefore = new Date(deadline);
    threeDaysBefore.setDate(deadline.getDate() - 3);

    let oneDayBefore = new Date(deadline);
    oneDayBefore.setDate(deadline.getDate() - 1);

    let eightHoursBefore = new Date(deadline);
    eightHoursBefore.setHours(deadline.getHours() - 8);

    let li = document.createElement("li");

    li.innerHTML = `
        <strong>${task}</strong><br>
        Deadline: ${deadline.toLocaleString()}<br>
        Reminder 1: ${threeDaysBefore.toLocaleString()}<br>
        Reminder 2: ${oneDayBefore.toLocaleString()}<br>
        Reminder 3: ${eightHoursBefore.toLocaleString()}
    `;

    document.getElementById("taskList").appendChild(li);

    taskInput.value = "";
    deadlineInput.value = "";
});