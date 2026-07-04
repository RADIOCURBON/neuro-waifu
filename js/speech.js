/* ==========================================================
                    SPEECH.JS (финальная версия)
                Голосовой ввод NeuroWaifu
==========================================================*/

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const micBtn = document.getElementById("mic");
const input = document.getElementById("message");

let recognition = null;
let isListening = false;
let finalText = "";
let hasPermission = false; // флаг, что разрешение уже получено

function initSpeech() {
    if (!SpeechRecognition) {
        console.warn("SpeechRecognition не поддерживается браузером");
        micBtn.style.opacity = "0.4";
        micBtn.title = "Голосовой ввод не поддерживается";
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = "ru-RU";
    recognition.continuous = true;
    recognition.interimResults = true;

    micBtn.addEventListener("click", toggleRecognition);

    recognition.onresult = (event) => {
        let interimText = "";
        let isFinalChunk = false;

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalText += transcript + " ";
                isFinalChunk = true;
            } else {
                interimText += transcript;
            }
        }

        const fullText = finalText + interimText;
        if (isFinalChunk) {
            typeText(input, fullText, 18);
        } else {
            input.value = fullText;
        }
    };

    recognition.onend = () => {
        if (isListening) {
            try {
                recognition.start();
            } catch (e) {}
        }
    };

    recognition.onerror = (event) => {
        console.warn("Ошибка распознавания:", event.error);
        if (event.error === "not-allowed") {
            isListening = false;
            micBtn.classList.remove("recording");
            hasPermission = false; // разрешение было отклонено, сбросим флаг
        }
    };
}

function toggleRecognition() {
    if (!recognition) return;
    if (isListening) {
        stopRecognition();
    } else {
        // Если разрешение ещё не получено, запрашиваем его
        if (!hasPermission) {
            requestMicrophonePermission();
        } else {
            startRecognition();
        }
    }
}

function requestMicrophonePermission() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
            hasPermission = true;
            startRecognition();
        })
        .catch((err) => {
            console.warn("Разрешение на микрофон отклонено:", err);
            micBtn.style.opacity = "0.4";
            micBtn.title = "Микрофон запрещён в браузере";
        });
}

function startRecognition() {
    if (!recognition) return;
    finalText = input.value || "";
    try {
        recognition.start();
        isListening = true;
        micBtn.classList.add("recording");
    } catch (e) {
        // Если возникла ошибка (например, разрешение не получено), пробуем запросить
        if (!hasPermission) {
            requestMicrophonePermission();
        }
    }
}

function stopRecognition() {
    if (!recognition) return;
    try {
        recognition.stop();
    } catch (e) {}
    isListening = false;
    micBtn.classList.remove("recording");
}

// Экспорт для app.js
window.initSpeech = initSpeech;