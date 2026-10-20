// Очікуємо повне завантаження DOM-дерева
document.addEventListener('DOMContentLoaded', () => {
    // Селектори для елементів інтерфейсу
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const taskCounter = document.getElementById('task-counter');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Масив для збереження об'єктів завдань. Структура: { id, text, completed }
    let todos = [];
    // Змінна поточного фільтру ('all', 'active', 'completed')
    let currentFilter = 'all';

    // 1. ІНІЦІАЛІЗАЦІЯ: завантаження даних із localStorage
    const loadFromLocalStorage = () => {
        const storedTodos = localStorage.getItem('todos');
        if (storedTodos) {
            todos = JSON.parse(storedTodos);
        }
        render(); // Відображаємо завантажений список
    };

    // 2. ЗБЕРЕЖЕННЯ: запис поточного стану в localStorage
    const saveToLocalStorage = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    // 3. ФУНКЦІЯ ДОДАВАННЯ ЗАВДАННЯ
    const addTodo = () => {
        const text = todoInput.value.trim(); // Видаляємо зайві пробіли
        
        // Перевірка на порожнє поле (Обов'язкова вимога 1)
        if (text === '') return;

        // Створюємо новий об'єкт завдання
        const newTodo = {
            id: Date.now(), // Унікальний ідентифікатор через мілісекунди
            text: text,
            completed: false
        };

        todos.push(newTodo);
        todoInput.value = ''; // Очищаємо поле вводу
        
        saveToLocalStorage();
        render();
    };

    // 4. ФУНКЦІЯ ВИДАЛЕННЯ ЗАВДАННЯ
    const deleteTodo = (id) => {
        todos = todos.filter(todo => todo.id !== id);
        saveToLocalStorage();
        render();
    };

    // 5. ФУНКЦІЯ ЗМІНИ СТАТУСУ (Виконано / Не виконано)
    const toggleTodo = (id) => {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        saveToLocalStorage();
        render();
    };

    // 6. ОЧИЩЕННЯ ВИКОНАНИХ ЗАВДАННЯ (Додатковий бал)
    const clearCompleted = () => {
        todos = todos.filter(todo => !todo.completed);
        saveToLocalStorage();
        render();
    };

    // 7. ОНОВЛЕННЯ ЛІЧИЛЬНИКА ТА СТАТИСТИКИ (Додатковий бал)
    const updateCounter = () => {
        const total = todos.length;
        const active = todos.filter(todo => !todo.completed).length;
        taskCounter.textContent = `Усього: ${total} | Залишилось: ${active}`;
    };

    // 8. ГОЛОВНА ФУНКЦІЯ РЕНДЕРИНГУ (ВІДОБРАЖЕННЯ) ІНТЕРФЕЙСУ
    const render = () => {
        todoList.innerHTML = ''; // Очищаємо список перед новим виводом

        // Фільтрація масиву перед відображенням (Додатковий бал)
        let filteredTodos = todos;
        if (currentFilter === 'active') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }

        // Генерація HTML елементів для кожного завдання
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

            // Контейнер лівої частини (чекбокс + текст)
            const leftDiv = document.createElement('div');
            leftDiv.className = 'todo-item-left';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            // Обробник кліку на чекбокс (Обов'язкова вимога 2)
            checkbox.addEventListener('change', () => toggleTodo(todo.id));

            const span = document.createElement('span');
            span.className = 'todo-text';
            span.textContent = todo.text;

            leftDiv.appendChild(checkbox);
            leftDiv.appendChild(span);

            // Кнопка видалення (Обов'язкова вимога 3)
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Видалити';
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

            li.appendChild(leftDiv);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });

        updateCounter();
    };

    // --- ОБРОБНИКИ ПОДІЙ (EVENT LISTENERS) ---

    // Клік на кнопку "Додати"
    addBtn.addEventListener('click', addTodo);

    // Натискання клавіші Enter у полі вводу (Обов'язкова вимога 1)
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // Клік по кнопках фільтрації (Додатковий бал)
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            render();
        });
    });

    // Клік на кнопку "Очистити виконані" (Додатковий бал)
    clearCompletedBtn.addEventListener('click', clearCompleted);

    // Запуск програми при завантаженні сторінки
    loadFromLocalStorage();
});
