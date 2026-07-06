function init() {
    console.log("NeuroWaifu запущена");
    initMessages();
    if (typeof initSpeech === "function") {
        initSpeech();
    }
    if (typeof initRightSidebar === "function") {
        initRightSidebar();
    }
    
}
document.addEventListener("DOMContentLoaded", init);
