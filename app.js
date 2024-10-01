/// Function to update and display the last seen time
function updateLastSeen() {
    const lastSeen = localStorage.getItem('lastSeen');

    if (lastSeen) {
        alert(`You last viewed this list on: ${lastSeen}`);
    } else {
        alert("This is your first time viewing this list!");
    }

    const now = new Date().toLocaleString();
    localStorage.setItem('lastSeen', now);
}

// Function to reorder the list items
function reorderList() {
    const listContainer = document.getElementById("list-container");
    const listItems = Array.from(listContainer.children);

    // Sort list items: unchecked items first, checked items last
    listItems.sort((a, b) => {
        if (a.classList.contains('checked') && !b.classList.contains('checked')) {
            return 1; // Move checked items after unchecked items
        } else if (!a.classList.contains('checked') && b.classList.contains('checked')) {
            return -1; // Move unchecked items before checked items
        } else {
            return 0; // Maintain the order of items with the same checked status
        }
    });

    // Append sorted items back to the list container
    listItems.forEach(item => listContainer.appendChild(item));
}

// Function to add tasks to the list
function add() {
    const inputBox = document.getElementById("input-box");
    const listContainer = document.getElementById("list-container");

    if (inputBox.value === '') {
        alert("You must write something!");
    } else {
        const li = document.createElement("li");
        li.textContent = inputBox.value;
        li.draggable = true; // Make the list item draggable

        // Get the current date and time
        const now = new Date();
        const timestamp = now.toLocaleString(); // Formats the date and time

        // Create a span element for the timestamp
        const timeSpan = document.createElement("span");
        timeSpan.textContent = ` (${timestamp})`;
        timeSpan.className = "timestamp";
        li.appendChild(timeSpan);

        // Create a delete button
        const deleteBtn = document.createElement("span");
        deleteBtn.textContent = "\uD83D\uDDD1"; // Unicode for a trash can symbol
        deleteBtn.className = "delete-btn";
        li.appendChild(deleteBtn);

        listContainer.appendChild(li);

        // Adding event listener for the li element to toggle the checked class
        li.addEventListener("click", function() {
            li.classList.toggle("checked");
            reorderList(); // Reorder list items whenever a task is checked/unchecked
        });

        // Adding event listener for the delete button
        deleteBtn.addEventListener("click", function(event) {
            event.stopPropagation(); // Prevent click event from propagating to the list item
            listContainer.removeChild(li);
        });

        // Adding drag event listeners
        li.addEventListener('dragstart', function(event) {
            event.dataTransfer.setData('text/plain', event.target.id);
        });

        li.addEventListener('dragend', function() {
            // Optionally, you can handle the end of the drag event
        });

        // Reorder list items after adding a new one
        reorderList();
    }
    inputBox.value = "";
}

// Adding event listeners to existing list items (if any)
document.querySelectorAll("#list-container li").forEach(function(li) {
    li.addEventListener("click", function() {
        li.classList.toggle("checked");
        reorderList(); // Reorder list items whenever a task is checked/unchecked
    });

    li.querySelector(".delete-btn").addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent click event from propagating to the list item
        li.parentNode.removeChild(li);
    });

    li.addEventListener('dragstart', function(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
    });
});

// Handle drag over and drop events for the Delete Bin
const deleteBin = document.getElementById('delete-bin');

deleteBin.addEventListener('dragover', function(event) {
    event.preventDefault(); // Allow drop
    deleteBin.classList.add('drag-over');
});

deleteBin.addEventListener('dragleave', function() {
    deleteBin.classList.remove('drag-over');
});

deleteBin.addEventListener('drop', function(event) {
    event.preventDefault();
    deleteBin.classList.remove('drag-over');
    
    const data = event.dataTransfer.getData('text/plain');
    const item = document.getElementById(data);

    if (item) {
        item.remove();
    }
});

// Call the updateLastSeen function when the page is loaded
window.onload = function() {
    updateLastSeen();
};
