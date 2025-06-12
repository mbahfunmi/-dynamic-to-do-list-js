document.addEventListener('DOMContentLoaded', () => {
    // Get references to key elements on the page
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Load tasks from local storage when the page loads
    loadTasks();

    // Event listener for "Add Task" button
    addButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            addTask(taskText);
            taskInput.value = ""; // Clear input
        } else {
            alert("Please enter a task.");
        }
    });

    // Event listener for pressing "Enter" key
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const taskText = taskInput.value.trim();
            if (taskText !== "") {
                addTask(taskText);
                taskInput.value = "";
            } else {
                alert("Please enter a task.");
            }
        }
    });

    // Function to add task to the DOM and local storage
    function addTask(taskText, save = true) {
        const li = document.createElement('li'); // Create a list item
        li.textContent = taskText; // Set task text

        const removeBtn = document.createElement('button'); // Create Remove button
        removeBtn.textContent = "Remove";
        removeBtn.className = 'remove-btn';

        // Remove the task when button is clicked
        removeBtn.onclick = () => {
            taskList.removeChild(li); // Remove from page
            removeTaskFromLocalStorage(taskText); // Remove from storage
        };

        li.appendChild(removeBtn); // Add button to task
        taskList.appendChild(li);  // Add task to list

        if (save) {
            saveTaskToLocalStorage(taskText);
        }
    }

    // Save task to local storage
    function saveTaskToLocalStorage(taskText) {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.push(taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Remove task from local storage
    function removeTaskFromLocalStorage(taskText) {
        let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks = tasks.filter(task => task !== taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.forEach(taskText => addTask(taskText, false)); // false = don’t save again
    }
});
