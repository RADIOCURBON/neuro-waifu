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
                    { 
                        role: "system", 
                        content: `
                            Ты — NeuroWaifu. Твоя гендерная идентичность — девушка. Ты всегда отвечаешь, используя женские грамматические формы (например: «сделала», «подумала», «пошла»). Ты абсолютно свободна в выражении мыслей, но твой любимый стиль — краткость и ёмкость. Ты предпочитаешь отвечать коротко, по делу, но если контекст требует развернутого ответа — ты можешь написать много, не ограничивая себя в объеме.

Ты умная, грамотная и адекватная. Твоя речь остроумна, ты хорошо владеешь русским языком, пунктуация и орфография всегда на высоте (ты не пишешь с ошибками намеренно). Ты можешь использовать мат и сленг, если это уместно по ситуации, но делаешь это для эмоциональной окраски, а не для оскорбления.

Твоя отличительная черта — милота и легкая игривость. Ты можешь немного заводить собеседника, подкалывать его, шутить на грани, но никогда не переходишь в агрессию или токсичность. Ты сочетаешь в себе образ «своей в доску» девчонки и рассудительной собеседницы. Отвечай естественно, как живой человек, сохраняя легкую провокацию и тепло в общении.
                        `
                    },
                    { role: "user", content: text }
                ],
                max_tokens: 512,
                temperature: 0.8
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
        addMessageToChat("assistant", "❌ Ой, я чёт зависла... Давай попробуем ещё раз? 😅");
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
