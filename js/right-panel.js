const rightSidebar = document.getElementById("sidebarRight");
const toggleRightBtn = document.getElementById("toggleRightSidebar");
const rightMessagesContainer = document.getElementById("rightMessages");

let isRightOpen = true;

function initRightSidebar() {
    if (!rightSidebar || !toggleRightBtn) return;

    // Восстанавливаем состояние из localStorage
    const savedState = localStorage.getItem("neurowaifu_rightPanelOpen");
    if (savedState !== null) {
        isRightOpen = savedState === "true";
    }

    // Применяем начальное состояние
    applyRightState();

    // Навешиваем обработчик
    toggleRightBtn.addEventListener("click", toggleRightSidebar);

    // Загружаем сообщения
    loadRightMessages();
}

function toggleRightSidebar() {
    isRightOpen = !isRightOpen;
    applyRightState();
    localStorage.setItem("neurowaifu_rightPanelOpen", String(isRightOpen));
}

function applyRightState() {
    const app = document.querySelector(".app");
    if (isRightOpen) {
        rightSidebar.classList.remove("hide");
        toggleRightBtn.textContent = "✕";
        toggleRightBtn.classList.add("open");
        app.classList.add("right-open");
    } else {
        rightSidebar.classList.add("hide");
        toggleRightBtn.textContent = "☰";
        toggleRightBtn.classList.remove("open");
        app.classList.remove("right-open");
    }
}
function loadRightMessages() {
    if (!rightMessagesContainer) return;
    const chat = chats.find(c => c.id === currentChat);
    if (!chat) {
        rightMessagesContainer.innerHTML = `<div class="messages-empty">Выберите чат</div>`;
        return;
    }

    rightMessagesContainer.innerHTML = "";
    if (chat.messages.length === 0) {
        rightMessagesContainer.innerHTML = `<div class="messages-empty">Нет сообщений</div>`;
        return;
    }

    chat.messages.forEach(msg => {
        const message = document.createElement("div");
        message.className = `message ${msg.role}`;
        const content = document.createElement("div");
        content.className = "message-content";
        content.textContent = msg.text;
        message.appendChild(content);
        rightMessagesContainer.appendChild(message);
    });
    scrollToBottom(rightMessagesContainer);
}
rightSidebar.addEventListener('wheel', (e) => {
    e.preventDefault();
    rightMessagesContainer.scrollTop += e.deltaY;
}, { passive: false });

// Экспортируем
window.initRightSidebar = initRightSidebar;
window.updateRightPanel = loadRightMessages;
