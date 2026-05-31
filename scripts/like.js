const formElement = document.querySelector('#todo-form');
const inputElement = document.querySelector('#todo-input');
const listElement = document.querySelector('#todo-list');
const template = document.querySelector('#todo-item-template');

let items = [
  'Выучить JavaScript',
  'Сделать To-Do проект',
  'Изучить localStorage',
  'Написать createItem',
  'Добавить обработчики',
  'Сдать проект на отлично!'
];

function loadTasks() {
  const saved = localStorage.getItem('todoTasks');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } catch(e) {}
  }
  return [...items];
}

function saveTasks(tasksArray) {
  localStorage.setItem('todoTasks', JSON.stringify(tasksArray));
}

function getTasksFromDOM() {
  const itemsNamesElements = document.querySelectorAll('.todo-item-text');
  const tasks = [];
  itemsNamesElements.forEach(el => tasks.push(el.textContent));
  return tasks;
}

function createItem(taskText) {
  const clone = template.content.cloneNode(true);
  const taskElement = clone.querySelector('.todo-item');
  const textElement = taskElement.querySelector('.todo-item-text');
  const editButton = taskElement.querySelector('.todo-button-edit');
  const duplicateButton = taskElement.querySelector('.todo-button-duplicate');
  const deleteButton = taskElement.querySelector('.todo-button-delete');
  
  textElement.textContent = taskText;
  
  deleteButton.addEventListener('click', () => {
    taskElement.remove();
    saveTasks(getTasksFromDOM());
  });
  
  duplicateButton.addEventListener('click', () => {
    const newItem = createItem(textElement.textContent);
    listElement.prepend(newItem);
    saveTasks(getTasksFromDOM());
  });
  editButton.addEventListener('click', () => {
    textElement.setAttribute('contenteditable', 'true');
    textElement.focus();
  });
  
  textElement.addEventListener('blur', () => {
    if (textElement.getAttribute('contenteditable') === 'true') {
      textElement.setAttribute('contenteditable', 'false');
      textElement.textContent = textElement.textContent.trim();
      saveTasks(getTasksFromDOM());
    }
  });
  
  textElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && textElement.getAttribute('contenteditable') === 'true') {
      e.preventDefault();
      textElement.blur();
    }
  });
  
  return taskElement;
}

formElement.addEventListener('submit', (event) => {
  event.preventDefault();
  const taskText = inputElement.value.trim();
  if (!taskText) return alert('Введите текст задачи');
  
  const newTask = createItem(taskText);
  listElement.prepend(newTask);
  inputElement.value = '';
  saveTasks(getTasksFromDOM());
});

function renderTasks() {
  listElement.innerHTML = '';
  const tasks = loadTasks();
  tasks.forEach(task => {
    listElement.append(createItem(task));
  });
}
renderTasks();
