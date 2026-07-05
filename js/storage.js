function getUserChatsDocRef() {
    const user = auth.currentUser;
    if (!user) return null;
    return db.collection("userChats").doc(user.uid);
}

function getSettingsKey() {
    return APP_CONFIG.storage.settingsKey;
}

async function saveChats() {
    try {
        const docRef = getUserChatsDocRef();
        if (!docRef) return;

        await docRef.set({
            chats: JSON.stringify(chats),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        if (typeof DEBUG !== "undefined" && DEBUG) {
            console.log("✅ Чаты сохранены в Firestore:", chats.length);
        }
    } catch (error) {
        console.error("❌ Ошибка сохранения чатов:", error);
    }
}

async function loadChats() {
    try {
        const docRef = getUserChatsDocRef();
        if (!docRef) return null;

        const snap = await docRef.get();
        if (!snap.exists) return null;

        const raw = snap.data().chats;
        if (!raw) return null;

        const data = JSON.parse(raw);
        if (!Array.isArray(data)) {
            console.warn("⚠️ Данные из Firestore не являются массивом, сброс.");
            return null;
        }

        if (typeof DEBUG !== "undefined" && DEBUG) {
            console.log("✅ Чаты загружены из Firestore:", data.length);
        }
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

async function clearChats() {
    const docRef = getUserChatsDocRef();
    if (docRef) await docRef.delete();
}

function clearStorage() {
    clearChats();
    localStorage.removeItem(getSettingsKey());
}
