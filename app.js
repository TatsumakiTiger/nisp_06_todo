const input = document.getElementById('task-input');
const button = document.getElementById('add-btn');
const list = document.getElementById('task-list');
const emptyMsg = document.getElementById('empty-msg');
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

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

function addTask() {
  const value = input.value.trim();
  if (value === '') return;

  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  const span = document.createElement('span');
  span.textContent = value;

  const timestamp = document.createElement('span');
  timestamp.className = 'timestamp';

  const del = document.createElement('button');
  del.textContent = 'Usuń';
  del.className = 'delete-btn';
  del.addEventListener('click', () => {
    li.classList.add('removing');
    setTimeout(() => {
      li.remove();
      updateEmptyMsg();
    }, 300);
  });

  checkbox.addEventListener('change', () => {
    li.classList.toggle('done', checkbox.checked);
    if (checkbox.checked) {
      const now = new Date();
      const time = now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
      timestamp.textContent = `ukończono o ${time}`;
    } else {
      timestamp.textContent = '';
    }
  });

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

updateEmptyMsg();