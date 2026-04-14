const input = document.getElementById('task-input');
const button = document.getElementById('add-btn');
const list = document.getElementById('task-list');
const emptyMsg = document.getElementById('empty-msg');
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// --- dark mode ---
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.classList.add('spin');
  setTimeout(() => themeToggle.classList.remove('spin'), 400);
});

// --- tasks ---
function updateEmptyMsg() {
  emptyMsg.style.display = list.children.length === 0 ? 'block' : 'none';
}

function addTask(taskData) {
  const value = taskData?.text || input.value.trim();
  if (value === '') return;

  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = taskData?.done || false;

  const span = document.createElement('span');
  span.textContent = value;

  const timestamp = document.createElement('span');
  timestamp.className = 'timestamp';
  timestamp.textContent = taskData?.timestamp || '';

  const del = document.createElement('button');
  del.textContent = 'Usuń';
  del.className = 'delete-btn';

const taskObj = taskData || {
  id: Date.now(),
  text: value,
  done: checkbox.checked,
  timestamp: timestamp.textContent
};

  if (!taskData) {
    tasks.push(taskObj);
    saveTasks();
  }

  del.addEventListener('click', () => {
    li.classList.add('removing');
    setTimeout(() => {
      li.remove();
      tasks = tasks.filter(t => t.id !== taskObj.id);
      saveTasks();
      updateEmptyMsg();
    }, 300);
  });

  checkbox.addEventListener('change', () => {
    li.classList.toggle('done', checkbox.checked);

    if (checkbox.checked) {
      const now = new Date();
      const time = now.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit'
      });
      timestamp.textContent = `ukończono o ${time}`;
    } else {
      timestamp.textContent = '';
    }

    taskObj.done = checkbox.checked;
    taskObj.timestamp = timestamp.textContent;
    saveTasks();
  });

 if (checkbox.checked) {
  li.classList.add('done');

  // jeśli brak timestampu (np. stare dane), ustaw go
  if (!timestamp.textContent) {
    const now = new Date();
    const time = now.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit'
    });
    timestamp.textContent = `ukończono o ${time}`;
  }
}

  const left = document.createElement('div');
  left.className = 'li-left';
  left.appendChild(checkbox);

  const middle = document.createElement('div');
  middle.className = 'li-middle';
  middle.appendChild(span);
  middle.appendChild(timestamp);

  li.appendChild(left);
  li.appendChild(middle);
  li.appendChild(del);
  list.appendChild(li);

  input.value = '';
  updateEmptyMsg();
}

button.addEventListener('click', addTask);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

tasks.forEach(task => addTask(task));
updateEmptyMsg();