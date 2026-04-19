const STORAGE_KEY = 'todos-v1';

const state = {
  todos: [],
  filter: 'all',
};

const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const remainingCount = document.getElementById('remaining-count');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const filterButtons = [...document.querySelectorAll('.filter-btn')];
const template = document.getElementById('todo-item-template');

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state.todos = raw ? JSON.parse(raw) : [];
  } catch {
    state.todos = [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  state.todos.unshift({
    id: crypto.randomUUID(),
    text: trimmed,
    completed: false,
    createdAt: Date.now(),
  });

  saveTodos();
  render();
}

function setFilter(filter) {
  state.filter = filter;
  filterButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === filter);
  });
  render();
}

function toggleTodo(id) {
  const todo = state.todos.find((item) => item.id === id);
  if (!todo) return;
  todo.completed = !todo.completed;
  saveTodos();
  render();
}

function deleteTodo(id) {
  state.todos = state.todos.filter((todo) => todo.id !== id);
  saveTodos();
  render();
}

function clearCompleted() {
  state.todos = state.todos.filter((todo) => !todo.completed);
  saveTodos();
  render();
}

function filteredTodos() {
  if (state.filter === 'active') {
    return state.todos.filter((todo) => !todo.completed);
  }

  if (state.filter === 'completed') {
    return state.todos.filter((todo) => todo.completed);
  }

  return state.todos;
}

function render() {
  todoList.innerHTML = '';

  const visibleTodos = filteredTodos();

  if (visibleTodos.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = '표시할 할 일이 없습니다.';
    todoList.append(empty);
  } else {
    visibleTodos.forEach((todo) => {
      const node = template.content.firstElementChild.cloneNode(true);
      const checkbox = node.querySelector('.toggle');
      const text = node.querySelector('.todo-text');
      const deleteBtn = node.querySelector('.delete-btn');

      checkbox.checked = todo.completed;
      text.textContent = todo.text;
      text.classList.toggle('completed', todo.completed);

      checkbox.addEventListener('change', () => toggleTodo(todo.id));
      deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

      todoList.append(node);
    });
  }

  const remaining = state.todos.filter((todo) => !todo.completed).length;
  remainingCount.textContent = `남은 할 일: ${remaining}`;
}

addBtn.addEventListener('click', () => {
  addTodo(input.value);
  input.value = '';
  input.focus();
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTodo(input.value);
    input.value = '';
  }
});

clearCompletedBtn.addEventListener('click', clearCompleted);

filterButtons.forEach((button) => {
  button.addEventListener('click', () => setFilter(button.dataset.filter));
});

loadTodos();
render();
