// --- MODEL ---
class Task {
  constructor({ id = Date.now(), text, done = false, timestamp = '' }) {
    this.id = id;
    this.text = text;
    this.done = done;
    this.timestamp = timestamp;
  }

  toggle() {
    this.done = !this.done;

    if (this.done) {
      const now = new Date();
      const time = now.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit'
      });
      this.timestamp = `ukończono o ${time}`;
    } else {
      this.timestamp = '';
    }
  }
}

// --- STORAGE ---
class StorageService {
  static load() {
    const data = JSON.parse(localStorage.getItem('tasks')) || [];
    return data.map(task => new Task(task));
  }

  static save(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// --- RENDER ---
class TaskRenderer {
  constructor(listEl, onToggle, onDelete) {
    this.listEl = listEl;
    this.onToggle = onToggle;
    this.onDelete = onDelete;
  }

  render(task) {
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

    if (task.done) li.classList.add('done');

    checkbox.addEventListener('change', () =>
      this.onToggle(task, li, checkbox, timestamp)
    );

    del.addEventListener('click', () =>
      this.onDelete(task, li)
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

    this.listEl.appendChild(li);
  }

  clear() {
    this.listEl.innerHTML = '';
  }
}

// --- APP ---
class TaskApp {
  constructor() {
    this.input = document.getElementById('task-input');
    this.button = document.getElementById('add-btn');
    this.list = document.getElementById('task-list');
    this.emptyMsg = document.getElementById('empty-msg');
    this.themeToggle = document.getElementById('theme-toggle');
    this.html = document.documentElement;

    this.tasks = StorageService.load();

    this.renderer = new TaskRenderer(
      this.list,
      this.toggleTask.bind(this),
      this.deleteTask.bind(this)
    );

    this.init();
  }

  init() {
    this.initTheme();
    this.bindEvents();
    this.renderAll();
    this.updateEmptyMsg();
  }

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

  bindEvents() {
    this.button.addEventListener('click', () => this.addTask());
    this.input.addEventListener('keydown', e => {
      if (e.key === 'Enter') this.addTask();
    });
  }

  addTask() {
    const value = this.input.value.trim();
    if (!value) return;

    const task = new Task({ text: value });

    this.tasks.push(task);
    StorageService.save(this.tasks);

    this.renderer.render(task);

    this.input.value = '';
    this.updateEmptyMsg();
  }

  toggleTask(task, li, checkbox, timestampEl) {
    task.toggle();

    checkbox.checked = task.done;
    timestampEl.textContent = task.timestamp;
    li.classList.toggle('done', task.done);

    StorageService.save(this.tasks);
  }

  deleteTask(task, li) {
    li.classList.add('removing');

    setTimeout(() => {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
      StorageService.save(this.tasks);
      li.remove();
      this.updateEmptyMsg();
    }, 300);
  }

  renderAll() {
    this.renderer.clear();
    this.tasks.forEach(task => this.renderer.render(task));
  }

  updateEmptyMsg() {
    this.emptyMsg.style.display =
      this.tasks.length === 0 ? 'block' : 'none';
  }
}

// --- START ---
new TaskApp();