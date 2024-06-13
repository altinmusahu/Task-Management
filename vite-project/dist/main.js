document.addEventListener('DOMContentLoaded', (event) => {
  const taskTableBody = document.getElementById('taskTableBody');
  const addTaskForm = document.getElementById('addTaskForm');
  const taskTitleInput = document.getElementById('taskTitle');
  const taskDescriptionInput = document.getElementById('taskDescription');
  const searchInput = document.getElementById('searchInput');

  let allTasks = [];

  const fetchTasks = () => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(data => {
        allTasks = data.map(task => ({ ...task, status: false })); 
        renderTasks(allTasks);
        console.log(allTasks);
      })
      .catch(error => console.error('Error fetching tasks:', error));
  };

  const renderTasks = (tasks) => {
    taskTableBody.innerHTML = '';
    tasks.forEach(task => taskTableBody.appendChild(createTaskRow(task)));
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
    btnUpdate.setAttribute('data-button', task.id);
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
      newTask.status = false;
      allTasks.push(newTask);
      renderTasks(allTasks);
      taskTitleInput.value = '';
      taskDescriptionInput.value = '';
    })
    .catch(error => console.error('Error adding task:', error));
  });

  const updateTaskStatus = (id) => {
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    const statusElement = taskElement.querySelector('td:nth-child(3)'); 
    const currentStatus = statusElement.textContent === 'Completed';

    const updatedTask = {
      status: !currentStatus
    };

    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    })
    .then(response => response.json())
    .then(() => {
      statusElement.textContent = updatedTask.status ? 'Completed' : 'Pending';
      statusElement.className = updatedTask.status ? 'text-success' : 'text-danger';
    })
    .catch(error => console.error('Error updating task:', error));
  };

  const deleteTask = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      allTasks = allTasks.filter(task => task.id !== id);
      renderTasks(allTasks);
    })
    .catch(error => console.error('Error deleting task:', error));
  };

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredTasks = allTasks.filter(task => task.title.toLowerCase().includes(searchTerm));
    renderTasks(filteredTasks);
  });

  fetchTasks();
});
