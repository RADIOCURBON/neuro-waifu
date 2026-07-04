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

    try {
        const response = await fetch(APP_CONFIG.api.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${APP_CONFIG.api.apiKey}`
            },
            body: JSON.stringify({
                model: APP_CONFIG.api.model,
                messages: [
                    { role: "system", content: "Ты — дружелюбный ассистент NeuroWaifu." },
                    { role: "user", content: text }
                ],
                max_tokens: 512,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка API: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        const aiReply = data.choices?.[0]?.message?.content || "Не удалось получить ответ.";
        
        addMessageToChat("assistant", aiReply);
    } catch (error) {
        console.error("Ошибка нейросети:", error);
        addMessageToChat("assistant", "❌ Извини, нейросеть сейчас недоступна. Попробуй позже.");
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
