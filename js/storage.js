/* ==========================================================
                    STORAGE.JS (исправленный)
==========================================================*/

function getChatsKey() {
    return APP_CONFIG.storage.chatsKey;
}

function getSettingsKey() {
    return APP_CONFIG.storage.settingsKey;
}

function saveChats() {
    try {
        const data = JSON.stringify(chats);
        localStorage.setItem(getChatsKey(), data);
        if (DEBUG) console.log("✅ Чаты сохранены:", chats.length);
    } catch (error) {
        console.error("❌ Ошибка сохранения чатов:", error);
    }
}

function loadChats() {
    try {
        const raw = localStorage.getItem(getChatsKey());
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (!Array.isArray(data)) {
            console.warn("⚠️ Данные из localStorage не являются массивом, сброс.");
            return null;
        }
        if (DEBUG) console.log("✅ Чаты загружены:", data.length);
        return data;
    } catch (error) {
        console.error("❌ Ошибка загрузки чатов:", error);
        return null;
    }
}

function saveSettings(settings) {
    try {
        localStorage.setItem(getSettingsKey(), JSON.stringify(settings));
    } catch (error) {
        console.error("❌ Ошибка сохранения настроек:", error);
    }
}

function loadSettings() {
    try {
        const raw = localStorage.getItem(getSettingsKey());
        if (!raw) return {};
        return JSON.parse(raw);
    } catch (error) {
        console.error("❌ Ошибка загрузки настроек:", error);
        return {};
    }
}

function clearChats() {
    localStorage.removeItem(getChatsKey());
}

function clearStorage() {
    localStorage.removeItem(getChatsKey());
    localStorage.removeItem(getSettingsKey());
}