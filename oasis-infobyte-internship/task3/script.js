let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTimestamp() {
  return new Date().toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

function addTask() {
  let title = document.getElementById('taskTitle').value.trim();
  let desc = document.getElementById('taskDesc').value.trim();
  let editId = document.getElementById('editId').value;

  if (!title) {
    alert('Please enter a task title!');
    return;
  }

  if (editId) {
    // Update existing task
    let task = tasks.find(t => t.id == editId);
    if (task) {
      task.title = title;
      task.desc = desc || 'No description';
    }
    document.querySelector('.add-btn').innerHTML = '➕ Add Task';
    document.getElementById('editId').value = '';
  } else {
    // Add new task
    let task = {
      id: Date.now(),
      title,
      desc: desc || 'No description',
      created: getTimestamp(),
      completed: false,
      completedAt: null
    };
    tasks.unshift(task);
  }
  
  saveTasks();
  renderTasks(currentTab || 'all');
  clearForm();
}

function clearForm() {
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDesc').value = '';
}

function toggleComplete(id) {
  let task = tasks.find(t => t.id === id);
  if (task.completed) {
    task.completed = false;
    task.completedAt = null;
  } else {
    task.completed = true;
    task.completedAt = getTimestamp();
  }
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function editTask(id) {
  let task = tasks.find(t => t.id === id);
  document.getElementById('taskTitle').value = task.title;
  document.getElementById('taskDesc').value = task.desc;
  document.getElementById('editId').value = id;
  document.querySelector('.add-btn').innerHTML = '✏️ Update';
}

function renderTasks(filter = 'all') {
  let pendingList = document.getElementById('pending');
  let completedList = document.getElementById('completed');

  let pendingTasks = tasks.filter(t => !t.completed);
  let completedTasks = tasks.filter(t => t.completed);

  pendingList.innerHTML = '';
  completedList.innerHTML = '';

  if (filter === 'pending' || filter === 'all') {
    pendingTasks.forEach(task => {
      let li = createTaskElement(task);
      pendingList.appendChild(li);
    });
  }

  if (filter === 'completed' || filter === 'all') {
    completedTasks.forEach(task => {
      let li = createTaskElement(task);
      completedList.appendChild(li);
    });
  }
  
  updateCounts();
}

function updateCounts() {
  let pendingCount = tasks.filter(t => !t.completed).length;
  let completedCount = tasks.filter(t => t.completed).length;
  document.getElementById('pending-count').textContent = pendingCount;
  document.getElementById('completed-count').textContent = completedCount;
}

function createTaskElement(task) {
  let li = document.createElement('li');
  li.className = task.completed ? 'completed-task' : 'pending-task';
  
  li.innerHTML = `
    <div class="task-content">
      <div class="task-title">${task.title}</div>
      <div class="task-desc">${task.desc}</div>
      <div class="task-meta">
        <span>Added: ${task.created}</span>
        ${task.completedAt ? `<span>✓ Completed: ${task.completedAt}</span>` : ''}
      </div>
    </div>
    <div class="task-actions">
      <button class="edit" onclick="editTask(${task.id})">✏️</button>
      <button class="complete" onclick="toggleComplete(${task.id})">
        ${task.completed ? '↶ Undo' : '✓ Complete'}
      </button>
      <button class="delete" onclick="deleteTask(${task.id})">🗑️</button>
    </div>
  `;
  return li;
}

function showTab(tab, clickedBtn) {
  currentTab = tab;
  
  
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  clickedBtn.classList.add('active');
  
  
  document.querySelectorAll('.task-section').forEach(section => section.classList.remove('active'));
  if (tab === 'pending' || tab === 'all') {
    document.querySelector('.pending-section').classList.add('active');
  }
  if (tab === 'completed' || tab === 'all') {
    document.querySelector('.completed-section').classList.add('active');
  }
  
  renderTasks(tab);
}

let currentTab = 'all';


document.addEventListener('DOMContentLoaded', function() {
  updateCounts();
  renderTasks('all');
});

