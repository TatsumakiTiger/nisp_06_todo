const input = document.getElementById('task-input');
const button = document.getElementById('add-btn');
const list = document.getElementById('task-list');
const emptyMsg = document.getElementById('empty-msg');

function updateEmptyMsg() {
  emptyMsg.style.display = list.children.length === 0 ? 'block' : 'none';
}

function addTask() {
  const value = input.value.trim();
  if (value === '') return;

  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.addEventListener('change', () => {
    li.classList.toggle('done', checkbox.checked);
  });

  const span = document.createElement('span');
  span.textContent = value;

  const del = document.createElement('button');
  del.textContent = '✕';
  del.className = 'delete-btn';
  del.addEventListener('click', () => {
    li.classList.add('removing');
    setTimeout(() => {
      li.remove();
      updateEmptyMsg();
    }, 300);
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(del);
  list.appendChild(li);

  input.value = '';
  updateEmptyMsg();
}

button.addEventListener('click', addTask);

input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') addTask();
});

updateEmptyMsg();