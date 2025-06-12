// This event listener ensures that our JavaScript code runs only after the entire HTML document
// has been fully loaded and parsed. This prevents errors that might occur if we try to
// access DOM elements before they exist.
document.addEventListener('DOMContentLoaded', () => {
    // 1. Select DOM Elements:
    // We use document.getElementById to get references to the specific HTML elements
    // we will interact with. Storing them in constants improves readability and performance.
    const addButton = document.getElementById('add-task-btn'); // The "Add Task" button
    const taskInput = document.getElementById('task-input');   // The input field where users type tasks
    const taskList = document.getElementById('task-list');     // The unordered list (UL) where tasks will be displayed

    /**
     * Custom Message Box Function:
     * This function creates a temporary message box in the DOM to display
     * non-blocking messages to the user, replacing the standard 'alert()'.
     * @param {string} message - The text content of the message.
     * @param {string} type - The type of message ('info' or 'error'), which affects styling.
     */
    function showMessage(message, type = 'info') {
        const messageBox = document.createElement('div'); // Create a new div element
        messageBox.textContent = message; // Set its text content
        messageBox.className = 'message-box'; // Add a base class for styling
        if (type === 'error') {
            messageBox.classList.add('error'); // Add 'error' class if type is error
        }

        // Append the message box to the body
        document.body.appendChild(messageBox);

        // A small delay before setting opacity to 1 allows the CSS transition to apply,
        // creating a fade-in effect.
        setTimeout(() => {
            messageBox.style.opacity = 1;
        }, 10);

        // After 3 seconds, fade out the message box and then remove it from the DOM.
        setTimeout(() => {
            messageBox.style.opacity = 0;
            // Remove the element after the fade-out transition is complete
            messageBox.addEventListener('transitionend', () => messageBox.remove());
        }, 3000);
    }

    /**
     * loadTasks Function:
     * This function is responsible for retrieving tasks from Local Storage
     * when the page loads and displaying them in the To-Do list.
     */
    function loadTasks() {
        // Retrieve the 'tasks' item from Local Storage.
        // localStorage.getItem() returns a string or null if the item doesn't exist.
        // We use '[]' as a fallback if nothing is found, so JSON.parse always gets a valid string.
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');

        // Iterate over each task text in the stored array
        storedTasks.forEach(taskText => {
            // Call addTask for each stored task.
            // The 'false' argument for the 'save' parameter is crucial here:
            // it tells addTask *not* to save this task back to Local Storage again,
            // as it's already coming *from* Local Storage. This prevents duplication.
            addTask(taskText, false);
        });
    }

    /**
     * addTask Function:
     * This function handles the logic for adding a new task to the DOM and
     * optionally saving it to Local Storage.
     * @param {string} [taskTextFromParam] - Optional: The text of the task to add.
     * If not provided, it's taken from the input field.
     * @param {boolean} [save=true] - Optional: A flag indicating whether to save the task
     * to Local Storage. Defaults to true for new tasks.
     */
    function addTask(taskTextFromParam, save = true) {
        // Get the task text. If taskTextFromParam is provided (e.g., when loading from storage), use it.
        // Otherwise, get the value from the task input field and trim whitespace.
        const taskText = taskTextFromParam || taskInput.value.trim();

        // Validate the input: If the task text is empty after trimming, show an error message
        // and exit the function.
        if (taskText === '') {
            showMessage('Please enter a task.', 'error');
            return;
        }

        // 2. Task Creation:
        // Create a new list item (<li>) element.
        const li = document.createElement('li');
        // Set the text content of the <li> to the task text.
        li.textContent = taskText;

        // Create a new button element for removing the task.
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove'; // Set the button's visible text.
        removeButton.className = 'remove-btn'; // Assign a CSS class for styling.

        // Assign an onclick event listener directly to the remove button.
        // When this button is clicked:
        removeButton.onclick = () => {
            taskList.removeChild(li); // Remove the entire <li> element (the task) from the <ul>.
            // 3. Implement Task Removal with Local Storage Update:
            // After removing from the DOM, update Local Storage.
            // We pass the taskText to filter it out from the stored array.
            updateLocalStorageOnRemoval(taskText);
        };

        // Append the remove button as a child of the <li> element.
        li.appendChild(removeButton);
        // Append the newly created <li> (which now contains the task text and a remove button)
        // to the <ul> element on the page.
        taskList.appendChild(li);

        // Clear the input field after a task has been successfully added.
        taskInput.value = '';

        // Update Task Addition Functionality (with Local Storage):
        // If the 'save' flag is true (meaning this is a new task added by the user),
        // we need to save it to Local Storage.
        if (save) {
            // Get the current list of tasks from Local Storage.
            // Parse it from JSON to a JavaScript array. If no tasks are stored, default to an empty array.
            const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            // Add the new task's text to the array.
            storedTasks.push(taskText);
            // Convert the updated array back to a JSON string and save it to Local Storage.
            localStorage.setItem('tasks', JSON.stringify(storedTasks));
        }
    }

    /**
     * updateLocalStorageOnRemoval Function:
     * This function updates the 'tasks' array in Local Storage after a task has been removed.
     * @param {string} taskToRemove - The text content of the task that needs to be removed from Local Storage.
     */
    function updateLocalStorageOnRemoval(taskToRemove) {
        // Retrieve the current tasks from Local Storage and parse them.
        let storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        // Filter the array to create a new array that excludes the task that was just removed.
        storedTasks = storedTasks.filter(task => task !== taskToRemove);
        // Save the modified array back to Local Storage.
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
    }

    // 4. Attach Event Listeners:
    // Add an event listener to the "Add Task" button.
    // When the button is clicked, the addTask function will be called.
    addButton.addEventListener('click', () => addTask());

    // Add an event listener to the task input field for 'keypress' events.
    // This allows users to add tasks by pressing the 'Enter' key.
    taskInput.addEventListener('keypress', (event) => {
        // Check if the pressed key is 'Enter'.
        if (event.key === 'Enter') {
            addTask(); // If it is, call the addTask function.
        }
    });

    // Invoke Load Function:
    // Finally, call the loadTasks function when the DOM content is fully loaded.
    // This ensures that any tasks saved from a previous session are loaded and displayed
    // when the user opens the application.
    loadTasks();
});
