const input = document.getElementById('task-input');
const button = document.getElementById('add-btn');
const list = document.getElementById('task-list');

button.addEventListener('click', function () {
  const value = input.value.trim();

  if (value === '') return;

  const li = document.createElement('li');
  li.textContent = value;
  list.appendChild(li);

  input.value = '';
});