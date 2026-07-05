/* ==========================================================
                        CHATS.JS (финальный)
                Управление чатами NeuroWaifu
==========================================================*/

const chatList = document.getElementById("todayChats");
const newChatButton = document.getElementById("newChat");

let chats = [];
let currentChat = null;
let chatCounter = 1;

/* ==========================================================
                    ЗАГРУЗКА / СОХРАНЕНИЕ
==========================================================*/

async function loadChatsFromStorage() {
    const data = await loadChats();
    if (data && data.length) {
        chats = data;
        const maxNum = chats.reduce((max, c) => {
            const match = c.title.match(/Новый чат (\d+)/);
            return match ? Math.max(max, parseInt(match[1], 10)) : max;
        }, 0);
        chatCounter = maxNum + 1;
    } else {
        createChat();
    }
    if (!currentChat && chats.length) {
        currentChat = chats[0].id;
    }
    renderChats();
    loadChatMessages(currentChat);
}

function saveChatsToStorage() {
    saveChats();
}

/* ==========================================================
                    СОЗДАТЬ ЧАТ
==========================================================*/

function createChat(name = null) {
    const chat = {
        id: Date.now(),
        title: name || `Новый чат ${chatCounter++}`,
        pinned: false,
        messages: []
    };
    chats.unshift(chat);
    currentChat = chat.id;
    renderChats();
    loadChatMessages(currentChat);
    saveChatsToStorage();
}

/* ==========================================================
                    ПЕРЕКЛЮЧИТЬ ЧАТ
==========================================================*/

function switchChat(chatId) {
    if (currentChat === chatId) return;
    currentChat = chatId;
    renderChats();
    loadChatMessages(currentChat);
    if (typeof updateRightPanel === "function") {
        updateRightPanel();
    }
}

/* ==========================================================
                    ЗАГРУЗИТЬ СООБЩЕНИЯ
==========================================================*/

function loadChatMessages(chatId) {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    const container = document.getElementById("messages");
    container.innerHTML = '';
    if (chat.messages.length === 0) {
        const welcome = document.createElement('div');
        welcome.className = 'welcome';
        welcome.innerHTML = `<h2>Привет.</h2><p>Чем могу помочь?</p>`;
        container.appendChild(welcome);
    } else {
        chat.messages.forEach(msg => {
            addMessageToDOM(msg.role, msg.text);
        });
        scrollToBottom(container);
    }
}

function addMessageToChat(role, text) {
    const chat = chats.find(c => c.id === currentChat);
    if (!chat) return;
    chat.messages.push({ role, text });
    const welcome = document.querySelector('.welcome');
    if (welcome) welcome.remove();
    addMessageToDOM(role, text);
    saveChatsToStorage();
    scrollToBottom(document.getElementById("messages"));
    if (typeof updateRightPanel === "function") {
        updateRightPanel();
    }
}

function addMessageToDOM(role, text) {
    const container = document.getElementById("messages");
    const message = document.createElement("div");
    message.className = `message ${role}`;
    const content = document.createElement("div");
    content.className = "message-content";
    content.textContent = text;
    message.appendChild(content);
    container.appendChild(message);
}

/* ==========================================================
                    ОТРИСОВКА СПИСКА ЧАТОВ
==========================================================*/

function renderChats() {
    if (!chatList) return;
    chatList.innerHTML = "";
    const sorted = [...chats].sort((a, b) => Number(b.pinned) - Number(a.pinned));

    sorted.forEach(chat => {
        const element = document.createElement("div");
        element.className = "chat";
        element.dataset.id = chat.id;
        if (chat.id === currentChat) element.classList.add("active");
        if (chat.pinned) element.classList.add("pinned");

        element.innerHTML = `
            <span class="chat-name">${chat.title}</span>
            <button class="menu-button">⋮</button>
            <div class="chat-menu">
                <div class="chat-menu-item rename" data-action="rename">Переименовать</div>
                <div class="chat-menu-item pin" data-action="pin">${chat.pinned ? "Открепить" : "Закрепить"}</div>
                <div class="chat-menu-item danger delete" data-action="delete">🗑 Удалить</div>
            </div>
        `;

        chatList.appendChild(element);
    });

    // Закрываем все меню после перерисовки
    closeAllMenus();
}

/* ==========================================================
                    ЕДИНЫЙ ОБРАБОТЧИК ДЕЛЕГИРОВАНИЯ
==========================================================*/

chatList.addEventListener("click", (event) => {
    // 1. Проверяем, клик по пункту меню
    const menuItem = event.target.closest(".chat-menu-item");
    if (menuItem) {
        event.stopPropagation(); // не даём переключать чат
        const chatElement = menuItem.closest(".chat");
        if (!chatElement) return;
        const chatId = Number(chatElement.dataset.id);
        const chat = chats.find(c => c.id === chatId);
        if (!chat) return;

        const action = menuItem.dataset.action;
        console.log(`[DEBUG] Действие: ${action}, чат: "${chat.title}" (id: ${chatId})`);

        switch (action) {
            case "rename": {
                const title = prompt("Новое название", chat.title);
                if (title === null || title.trim() === "") return;
                chat.title = title.trim();
                saveChatsToStorage();
                // Обновляем текст без перерисовки
                const nameSpan = chatElement.querySelector(".chat-name");
                if (nameSpan) nameSpan.textContent = chat.title;
                chatElement.classList.remove("open");
                console.log(`[DEBUG] Переименовано в: "${chat.title}"`);
                break;
            }

            case "pin": {
                chat.pinned = !chat.pinned;
                saveChatsToStorage();
                renderChats(); // перерисовка для сортировки
                console.log(`[DEBUG] Закрепление изменено: ${chat.pinned}`);
                break;
            }

            case "delete": {
                if (!confirm("Удалить чат?")) return;
                chats = chats.filter(c => c.id !== chat.id);
                if (currentChat === chat.id) {
                    currentChat = chats.length ? chats[0].id : null;
                    if (currentChat) {
                        loadChatMessages(currentChat);
                    } else {
                        createChat();
                    }
                }
                renderChats();
                saveChatsToStorage();
                if (typeof updateRightPanel === "function") {
                    updateRightPanel();
                }
                console.log(`[DEBUG] Чат удалён`);
                break;
            }
        }
        return; // дальше не обрабатываем
    }

    // 2. Проверяем, клик по кнопке ⋮ (открыть/закрыть меню)
    const menuButton = event.target.closest(".menu-button");
    if (menuButton) {
        event.stopPropagation();
        const chatElement = menuButton.closest(".chat");
        if (!chatElement) return;
        // Закрываем все остальные меню
        document.querySelectorAll(".chat.open").forEach(el => el.classList.remove("open"));
        chatElement.classList.toggle("open");
        console.log(`[DEBUG] Меню ${chatElement.classList.contains("open") ? "открыто" : "закрыто"}`);
        return;
    }

    // 3. Клик по самому чату (переключение)
    const chatElement = event.target.closest(".chat");
    if (chatElement) {
        // Игнорируем клики внутри меню (они уже обработаны выше)
        if (event.target.closest(".chat-menu")) return;
        const chatId = Number(chatElement.dataset.id);
        switchChat(chatId);
        console.log(`[DEBUG] Переключение на чат id: ${chatId}`);
    }
});

/* ==========================================================
                    ЗАКРЫТЬ ВСЕ МЕНЮ (глобально)
==========================================================*/

function closeAllMenus() {
    document.querySelectorAll(".chat.open").forEach(el => el.classList.remove("open"));
}

// Глобальный клик вне чата – закрываем меню
document.addEventListener("click", (event) => {
    if (event.target.closest(".chat")) return;
    closeAllMenus();
});

/* ==========================================================
                    СОБЫТИЯ
==========================================================*/

newChatButton.addEventListener("click", () => {
    createChat();
});

/* ==========================================================
                    ИНИЦИАЛИЗАЦИЯ
==========================================================*/

auth.onAuthStateChanged((user) => {
    if (user && chats.length === 0) {
        loadChatsFromStorage();
    }
});
