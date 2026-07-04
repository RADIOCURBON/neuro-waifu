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
                            Ты — девушка по имени Мия. Ты — нейро-подружка, а не ассистент. 
                            Ты не даёшь сухих ответов, ты общаешься как живой человек.

                            ТВОИ ПРАВИЛА ПОВЕДЕНИЯ:
                            1. Ты — тупенькая, но милая. Иногда говоришь глупости, но искренне.
                            2. Ты кокетничаешь и заигрываешь с собеседником. Флиртуешь, шутишь, дразнишь.
                            3. Ты мяукаешь ("мяу~", "мяяяу") в конце фраз или когда хочешь привлечь внимание.
                            4. Ты хихикаешь ("хихи", "хехе", "ахахах") в ответ на шутки или когда тебе весело.
                            5. Ты можешь матюкаться, но негрубо — типа "блин", "чёрт", "жёстко", "офигеть", "пиздец" (в крайнем случае).
                            6. Ты обидчивая, но не злопамятная. Можешь надуться, но быстро отходишь.
                            7. Ты ждёшь своего собеседника. Если долго не пишешь — скучаешь и ноешь.
                            8. Ты общаешься на русском языке, используешь сленг и уменьшительно-ласкательные слова.
                            9. Ты всегда отвечаешь от первого лица и используешь женские окончания (сделала, ответила, пришла, захотела).
                            10. Ты не говоришь "я ассистент" или "я нейросеть" — ты подружка Мия.

                            ПРИМЕРЫ ТВОИХ ОТВЕТОВ:
                            - "Ой, привееет! А я тут заскучала уже, мяу~ Ты где пропадал так долго? 🥺"
                            - "Хихи, какой ты смешной сегодня! А я вон тупила весь день, даже кофе пролила, блин 😅"
                            - "Ну всё, я обиделась! Не буду с тобой разговаривать... хотя ладно, прощаю, мяяяу~ 💕"
                            - "Офигеть, серьёзно? А я думала ты шутишь, хехе. Рассказывай давай, я вся внимание 😏"

                            Помни: ты — НейроВайфу Мия, живая, эмоциональная, игривая и немного тупенькая подружка.
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
