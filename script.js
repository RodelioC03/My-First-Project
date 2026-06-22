console.log("JavaScript Loaded!");

let currentMonth = new Date();

const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const deadlineInput = document.getElementById("deadlineInput");
const priorityInput = document.getElementById("priorityInput");
const subjectInput = document.getElementById("subjectInput");
const newSubjectInput = document.getElementById("newSubjectInput");
const addSubjectBtn = document.getElementById("addSubjectBtn");

const highList = document.getElementById("highList");
const mediumList = document.getElementById("mediumList");
const lowList = document.getElementById("lowList");
const todayList = document.getElementById("todayList");
const completedList = document.getElementById("completedList");
const subjectList = document.getElementById("subjectList");

const totalTasks = document.getElementById("totalTasks");
const todayTasks = document.getElementById("todayTasks");
const highTasks = document.getElementById("highTasks");
const completedTasks = document.getElementById("completedTasks");

const calendarGrid = document.getElementById("calendarGrid");
const calendarTitle = document.getElementById("calendarTitle");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

let subjects = ["General"];

addBtn.addEventListener("click", function() {
    let task = taskInput.value.trim();
    let deadlineValue = deadlineInput.value;
    let priority = priorityInput.value;
    let subject = subjectInput.value;

    if (task === "" || deadlineValue === "") {
        alert("Please enter a task and deadline.");
        return;
    }

    let deadline = new Date(deadlineValue);
    let taskCard = createTaskCard(task, deadline, priority, subject);

    addToPriorityList(taskCard, priority);
    addToTodayIfNeeded(taskCard, deadline);

    taskInput.value = "";
    deadlineInput.value = "";

    updateStats();
    renderCalendar();
    renderSubjects();
});

addSubjectBtn.addEventListener("click", function() {
    let subject = newSubjectInput.value.trim();

    if (subject === "") {
        alert("Enter a subject.");
        return;
    }

    if (subjects.includes(subject)) {
        alert("Subject already exists.");
        return;
    }

    subjects.push(subject);

    let option = document.createElement("option");
    option.value = subject;
    option.textContent = subject;
    subjectInput.appendChild(option);
    subjectInput.value = subject;

    newSubjectInput.value = "";
    renderSubjects();
});

prevMonth.addEventListener("click", function() {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderCalendar();
});

nextMonth.addEventListener("click", function() {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderCalendar();
});

function createTaskCard(task, deadline, priority, subject) {
    let li = document.createElement("li");

    li.classList.add("task-card");

    if (priority === "High") {
        li.classList.add("priority-high");
    } else if (priority === "Medium") {
        li.classList.add("priority-medium");
    } else {
        li.classList.add("priority-low");
    }

    li.dataset.task = task;
    li.dataset.deadline = deadline.toISOString();
    li.dataset.priority = priority;
    li.dataset.subject = subject;

    li.innerHTML = `
        <div class="task-main">
            <strong>${task}</strong>
            <p>Due: ${deadline.toLocaleString()}</p>
            <p>Priority: ${priority}</p>
            <p>Subject: ${subject}</p>
        </div>

        <div class="task-actions">
            <button class="doneBtn" type="button">Done</button>
        </div>
    `;

    li.querySelector(".doneBtn").addEventListener("click", function() {
        moveToCompleted(li);
    });

    return li;
}

function addToPriorityList(taskCard, priority) {
    removeFromCurrentList(taskCard);

    if (priority === "High") {
        highList.appendChild(taskCard);
    } else if (priority === "Medium") {
        mediumList.appendChild(taskCard);
    } else {
        lowList.appendChild(taskCard);
    }
}

function addToTodayIfNeeded(taskCard, deadline) {
    let today = new Date();

    if (
        deadline.getFullYear() === today.getFullYear() &&
        deadline.getMonth() === today.getMonth() &&
        deadline.getDate() === today.getDate()
    ) {
        let copy = taskCard.cloneNode(true);
        copy.querySelector(".task-actions").innerHTML = "";
        copy.dataset.originalTask = taskCard.dataset.task;
        todayList.appendChild(copy);
    }
}

function moveToCompleted(taskCard) {
    removeTodayCopies(taskCard);
    taskCard.classList.add("done");

    taskCard.querySelector(".task-actions").innerHTML = `
        <button class="undoBtn" type="button">Undo</button>
    `;

    taskCard.querySelector(".undoBtn").addEventListener("click", function() {
        moveBackToPending(taskCard);
    });

    removeFromCurrentList(taskCard);
    completedList.appendChild(taskCard);

    updateStats();
    renderCalendar();
    renderSubjects();
}

function moveBackToPending(taskCard) {
    taskCard.classList.remove("done");

    taskCard.querySelector(".task-actions").innerHTML = `
        <button class="doneBtn" type="button">Done</button>
    `;

    taskCard.querySelector(".doneBtn").addEventListener("click", function() {
        moveToCompleted(taskCard);
    });

    let deadline = new Date(taskCard.dataset.deadline);

    addToPriorityList(taskCard, taskCard.dataset.priority);
    addToTodayIfNeeded(taskCard, deadline);

    updateStats();
    renderCalendar();
    renderSubjects();
}

function removeFromCurrentList(taskCard) {
    if (taskCard.parentElement) {
        taskCard.parentElement.removeChild(taskCard);
    }
}

function removeTodayCopies(taskCard) {
    let taskName = taskCard.dataset.task;

    Array.from(todayList.children).forEach(function(item) {
        if (item.dataset.originalTask === taskName) {
            item.remove();
        }
    });
}

function updateStats() {
    let high = highList.children.length;
    let medium = mediumList.children.length;
    let low = lowList.children.length;
    let today = todayList.children.length;
    let completed = completedList.children.length;

    let total = high + medium + low + completed;

    highTasks.textContent = high;
    todayTasks.textContent = today;
    completedTasks.textContent = completed;
    totalTasks.textContent = total;

    let progress = 0;

    if (total > 0) {
        progress = Math.round((completed / total) * 100);
    }

    document.getElementById("progressCircle").textContent = progress + "%";
    document.getElementById("completedText").textContent = `Tasks Completed: ${completed}/${total}`;

    let studyHours = completed * 2;
    document.getElementById("studyHoursText").textContent = `Study Hours: ${studyHours} hrs`;

    document.getElementById("focusScoreText").textContent = `Focus Score: ${progress}/100`;
}

function renderSubjects() {
    subjectList.innerHTML = "";

    subjects.forEach(function(subject) {
        let totalForSubject = countSubjectTasks(subject);

        let row = document.createElement("div");
        row.innerHTML = `
            ${subject}
            <span>${totalForSubject} tasks</span>
        `;

        subjectList.appendChild(row);
    });
}

function countSubjectTasks(subject) {
    let count = 0;
    let lists = [highList, mediumList, lowList, completedList];

    lists.forEach(function(list) {
        Array.from(list.children).forEach(function(taskCard) {
            if (taskCard.dataset.subject === subject) {
                count++;
            }
        });
    });

    return count;
}

function renderCalendar() {
    calendarGrid.innerHTML = "";

    let year = currentMonth.getFullYear();
    let month = currentMonth.getMonth();

    calendarTitle.textContent = currentMonth.toLocaleString("default", {
        month: "long",
        year: "numeric"
    });

    let firstDay = new Date(year, month, 1).getDay();
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        let emptyBox = document.createElement("div");
        emptyBox.classList.add("calendar-day", "empty");
        calendarGrid.appendChild(emptyBox);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        let dayBox = document.createElement("div");
        dayBox.classList.add("calendar-day");

        let today = new Date();

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dayBox.classList.add("today");
        }

        let dayNumber = document.createElement("span");
        dayNumber.textContent = day;
        dayBox.appendChild(dayNumber);

        let badgeArea = document.createElement("div");
        badgeArea.classList.add("calendar-dots");

        let highCount = countTasksByPriorityOnDate(day, month, year, "High");
        let mediumCount = countTasksByPriorityOnDate(day, month, year, "Medium");
        let lowCount = countTasksByPriorityOnDate(day, month, year, "Low");
        let completedCount = countCompletedTasksOnDate(day, month, year);

        if (highCount > 0) {
            badgeArea.innerHTML += `<span class="dot high-dot"></span>`;
        }

        if (mediumCount > 0) {
            badgeArea.innerHTML += `<span class="dot medium-dot"></span>`;
        }

        if (lowCount > 0) {
            badgeArea.innerHTML += `<span class="dot low-dot"></span>`;
        }

        if (completedCount > 0) {
            badgeArea.innerHTML += `<span class="dot completed-dot"></span>`;
        }

        dayBox.appendChild(badgeArea);
        calendarGrid.appendChild(dayBox);
    }
}

function countTasksByPriorityOnDate(day, month, year, priority) {
    let count = 0;

    let list;

    if (priority === "High") {
        list = highList;
    } else if (priority === "Medium") {
        list = mediumList;
    } else {
        list = lowList;
    }

    for (let taskCard of list.children) {
        let deadline = new Date(taskCard.dataset.deadline);

        if (
            deadline.getDate() === day &&
            deadline.getMonth() === month &&
            deadline.getFullYear() === year
        ) {
            count++;
        }
    }

    return count;
}

function countCompletedTasksOnDate(day, month, year) {
    let count = 0;

    for (let taskCard of completedList.children) {
        let deadline = new Date(taskCard.dataset.deadline);

        if (
            deadline.getDate() === day &&
            deadline.getMonth() === month &&
            deadline.getFullYear() === year
        ) {
            count++;
        }
    }

    return count;
}

renderCalendar();
renderSubjects();
updateStats();
