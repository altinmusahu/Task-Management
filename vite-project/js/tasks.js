document.addEventListener('DOMContentLoaded', (event) => {
  const taskTableBody = document.getElementById('taskTableBody');
  const addTaskForm = document.getElementById('addTaskForm');
  const taskTitleInput = document.getElementById('taskTitle');
  const taskDescriptionInput = document.getElementById('taskDescription');

  const fetchTasks = () => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(data => {
        const tasks = data;
        taskTableBody.innerHTML = ''; // Clear existing rows
        tasks.forEach(task => taskTableBody.appendChild(createTaskRow(task)));
      })
      .catch(error => console.error('Error fetching tasks:', error));
  };

  const createTaskRow = (task) => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', task.id);

    const tdTitle = document.createElement('td');
    tdTitle.textContent = task.title;
    tr.appendChild(tdTitle);

    const tdDescription = document.createElement('td');
    tdDescription.textContent = task.body || 'No description provided';
    tr.appendChild(tdDescription);

    const tdStatus = document.createElement('td');
    tdStatus.textContent = task.status ? 'Completed' : 'Pending';
    tdStatus.className = task.status ? 'text-success' : 'text-danger';
    tr.appendChild(tdStatus);

    const tdActions = document.createElement('td');

    const btnUpdate = document.createElement('button');
    btnUpdate.className = 'btn btn-primary btn-sm mr-2';
    btnUpdate.textContent = 'Update';
    btnUpdate.onclick = () => updateTaskStatus(task.id);

    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn btn-danger btn-sm';
    btnDelete.textContent = 'Delete';
    btnDelete.onclick = () => deleteTask(task.id);

    tdActions.appendChild(btnUpdate);
    tdActions.appendChild(btnDelete);
    tr.appendChild(tdActions);

    return tr;
  };

  addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTaskTitle = taskTitleInput.value.trim();
    const newTaskDescription = taskDescriptionInput.value.trim();

    if (newTaskTitle === '') return;

    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTaskTitle,
        body: newTaskDescription,
        userId: 1,
      })
    })
    .then(response => response.json())
    .then(newTask => {
      taskTableBody.appendChild(createTaskRow(newTask));
      taskTitleInput.value = ''; // Clear input field after adding
      taskDescriptionInput.value = ''; // Clear input field after adding
    })
    .catch(error => console.error('Error adding task:', error));
  });

  const updateTaskStatus = (taskId) => {
    const newTitle = prompt("Enter new title:");
    const newDescription = prompt("Enter new description:");

    if (newTitle && newDescription) {
      fetch(`https://jsonplaceholder.typicode.com/posts/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          body: newDescription,
          userId: 1
        })
      })
      .then(response => response.json())
      .then(updatedTask => {
        console.log('Task updated:', updatedTask);
        fetchTasks(); // Refresh tasks after update
      })
      .catch(error => console.error('Error updating task:', error));
    }
  };

  const deleteTask = (taskId) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${taskId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        console.log('Task deleted');
        fetchTasks(); // Refresh tasks after deletion
      } else {
        console.error('Error deleting task');
      }
    })
    .catch(error => console.error('Error deleting task:', error));
  };

  fetchTasks(); // Initial fetch of tasks
});
