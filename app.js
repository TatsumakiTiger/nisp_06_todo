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

class StorageService {
  static load() {
    const data = JSON.parse(localStorage.getItem('tasks')) || [];
    return data.map(t => new Task(t));
  }

  static save(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

class TaskApp {
  constructor() {
    this.input = document.getElementById('task-input');
    this.button = document.getElementById('add-btn');
    this.list = document.getElementById('task-list');
    this.emptyMsg = document.getElementById('empty-msg');
    this.themeToggle = document.getElementById('theme-toggle');
    this.html = document.documentElement;

    this.tasks = StorageService.load();

    this.init();
  }

  init() {
    this.initTheme();
    this.bindEvents();
    this.render();
    this.updateEmpty();
  }

  initTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    this.html.setAttribute('data-theme', saved);

    this.themeToggle.addEventListener('click', () => {
      const next =
        this.html.getAttribute('data-theme') === 'light'
          ? 'dark'
          : 'light';

      this.html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  bindEvents() {
    this.button.addEventListener('click', () => this.add());
    this.input.addEventListener('keydown', e => {
      if (e.key === 'Enter') this.add();
    });
  }

  add() {
    const value = this.input.value.trim();
    if (!value) return;

    const task = new Task({ text: value });
    this.tasks.push(task);

    StorageService.save(this.tasks);
    this.render();

    this.input.value = '';
    this.updateEmpty();
  }

  toggle(task) {
    task.toggle();
    StorageService.save(this.tasks);
    this.render();
  }

  remove(task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    StorageService.save(this.tasks);
    this.render();
  }

  render() {
    this.list.innerHTML = '';

    this.tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task';

      if (task.done) li.classList.add('task--done');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;

      checkbox.addEventListener('change', () => this.toggle(task));

      const content = document.createElement('div');
      content.className = 'task__content';

      const text = document.createElement('div');
      text.className = 'task__text';
      text.textContent = task.text;

      const ts = document.createElement('div');
      ts.className = 'task__timestamp';
      ts.textContent = task.timestamp;

      const del = document.createElement('button');
      del.className = 'task__delete';
      del.textContent = 'Usuń';
      del.addEventListener('click', () => this.remove(task));

      content.appendChild(text);
      content.appendChild(ts);

      li.appendChild(checkbox);
      li.appendChild(content);
      li.appendChild(del);

      this.list.appendChild(li);
    });

    this.updateEmpty();
  }

  updateEmpty() {
    this.emptyMsg.style.display =
      this.tasks.length === 0 ? 'block' : 'none';
  }
}

new TaskApp();