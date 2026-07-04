/* ==========================================================
                        ЭЛЕМЕНТЫ
==========================================================*/

const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");

/* ==========================================================
                    ОТПРАВИТЬ СООБЩЕНИЕ
==========================================================*/

async function sendMessage() {
    const text = messageInput.value.trim();
    if (text === "") return;

    addMessageToChat("user", text);
    messageInput.value = "";

    // Имитация ответа AI (замените на реальный API)
    // Отправляем запрос к Hugging Face
try {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium", // модель чата
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${APP_CONFIG.api.apiKey}`, // твой ключ
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: text,
                parameters: { max_length: 150 }
            })
        }
    );

    if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`);
    }

    const data = await response.json();
    // Hugging Face возвращает массив, берём первый ответ
    const aiReply = data[0]?.generated_text || "Не удалось получить ответ.";
    // Обрезаем, чтобы не повторялся наш запрос (иногда модель повторяет)
    const cleanReply = aiReply.replace(text, "").trim() || aiReply;

    addMessageToChat("assistant", cleanReply);
} catch (error) {
    console.error("Ошибка нейросети:", error);
    addMessageToChat("assistant", "❌ Извини, нейросеть сейчас недоступна.");
}
}

/* ==========================================================
                ENTER
==========================================================*/

function initMessages() {
    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
}