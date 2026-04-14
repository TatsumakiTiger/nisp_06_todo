class TaskApp {
  constructor() {
    this.input = document.getElementById('task-input');
    this.button = document.getElementById('add-btn');
    this.list = document.getElementById('task-list');
    this.emptyMsg = document.getElementById('empty-msg');
    this.themeToggle = document.getElementById('theme-toggle');
    this.html = document.documentElement;

    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    this.init();
  }

  // --- INIT ---
  init() {
    this.initTheme();
    this.bindEvents();
    this.renderTasks();
    this.updateEmptyMsg();
  }

  // --- THEME ---
  initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.html.setAttribute('data-theme', savedTheme);

    this.themeToggle.addEventListener('click', () => {
      const current = this.html.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';

      this.html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);

      this.themeToggle.classList.add('spin');
      setTimeout(() => this.themeToggle.classList.remove('spin'), 400);
    });
  }

  // --- EVENTS ---
  bindEvents() {
    this.button.addEventListener('click', () => this.handleAddTask());

    this.input.addEventListener('keydown', e => {
      if (e.key === 'Enter') this.handleAddTask();
    });
  }

  // --- STORAGE ---
  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  // --- UI ---
  updateEmptyMsg() {
    this.emptyMsg.style.display =
      this.list.children.length === 0 ? 'block' : 'none';
  }

  // --- TASK LOGIC ---
  handleAddTask() {
    const value = this.input.value.trim();
    if (!value) return;

    const task = {
      id: Date.now(),
      text: value,
      done: false,
      timestamp: ''
    };

    this.tasks.push(task);
    this.saveTasks();
    this.renderTask(task);

    this.input.value = '';
    this.updateEmptyMsg();
  }

  toggleTask(task, li, checkbox, timestampEl) {
    task.done = checkbox.checked;

    if (task.done) {
      const now = new Date();
      const time = now.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit'
      });

      task.timestamp = `ukończono o ${time}`;
      timestampEl.textContent = task.timestamp;
      li.classList.add('done');
    } else {
      task.timestamp = '';
      timestampEl.textContent = '';
      li.classList.remove('done');
    }

    this.saveTasks();
  }

  deleteTask(task, li) {
    li.classList.add('removing');

    setTimeout(() => {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
      this.saveTasks();
      li.remove();
      this.updateEmptyMsg();
    }, 300);
  }

  // --- RENDER ---
  renderTasks() {
    this.tasks.forEach(task => this.renderTask(task));
  }

  renderTask(task) {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;

    const span = document.createElement('span');
    span.textContent = task.text;

    const timestamp = document.createElement('span');
    timestamp.className = 'timestamp';
    timestamp.textContent = task.timestamp;

    const del = document.createElement('button');
    del.textContent = 'Usuń';
    del.className = 'delete-btn';

    if (task.done) {
      li.classList.add('done');
    }

    checkbox.addEventListener('change', () =>
      this.toggleTask(task, li, checkbox, timestamp)
    );

    del.addEventListener('click', () =>
      this.deleteTask(task, li)
    );

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

    this.list.appendChild(li);
  }
}

// --- START APP ---
new TaskApp();