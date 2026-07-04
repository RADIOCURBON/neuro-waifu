function init() {
    console.log("NeuroWaifu запущена");
    // Загружаем чаты из localStorage (это уже делается в chats.js, но оставим для страховки)
    if (typeof loadChatsFromStorage === "function") {
        // Если чаты ещё не загружены (например, если loadChatsFromStorage не вызывалась), вызываем
        if (!chats || chats.length === 0) {
            loadChatsFromStorage();
        }
    }
    initMessages();
    if (typeof initSpeech === "function") {
        initSpeech();
    }
    if (typeof initRightSidebar === "function") {
        initRightSidebar();
    }
}

document.addEventListener("DOMContentLoaded", init);