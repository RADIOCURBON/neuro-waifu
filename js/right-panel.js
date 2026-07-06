const rightSidebar = document.getElementById("sidebarRight"); 
const toggleRightBtn = document.getElementById("toggleRightSidebar"); 
const rightMessagesContainer = document.getElementById("rightMessages"); 
let isRightOpen = true; 

function initRightSidebar() { 
    if (!rightSidebar || !toggleRightBtn) return; 

    const savedState = localStorage.getItem("neurowaifu_rightPanelOpen"); 
    if (savedState !== null) { 
        isRightOpen = savedState === "true"; 
    } 

    applyRightState(); 
    toggleRightBtn.addEventListener("click", toggleRightSidebar); 
    loadRightMessages(); 

    // ============================================================
    // ПРОКРУТКА КОЛЁСИКОМ В ПРАВОЙ ПАНЕЛИ
    // ============================================================
    
    // 1) Перехватываем wheel на самом контейнере сообщений
    rightMessagesContainer.addEventListener("wheel", (e) => {
        const container = rightMessagesContainer;
        const atTop = container.scrollTop <= 0;
        const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight;
        
        // Не даём скроллу "уйти" дальше границ
        if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
            return; // пусть браузер сам разбирается
        }
        
        e.preventDefault();
        container.scrollTop += e.deltaY;
    }, { passive: false });

    // 2) На случай если курсор над header'ом/пустым местом панели —
    //    ловим wheel на всём сайдбаре
    rightSidebar.addEventListener("wheel", (e) => {
        if (e.target.closest("#rightMessages")) return; // уже обработано
        
        const container = rightMessagesContainer;
        e.preventDefault();
        container.scrollTop += e.deltaY;
    }, { passive: false });
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
        rightMessagesContainer.innerHTML = `<div style="padding:20px;color:var(--color-text-secondary);text-align:center;">Выберите чат</div>`; 
        return; 
    } 
    rightMessagesContainer.innerHTML = ""; 
    if (chat.messages.length === 0) { 
        rightMessagesContainer.innerHTML = `<div style="padding:20px;color:var(--color-text-secondary);text-align:center;">Нет сообщений</div>`; 
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

window.initRightSidebar = initRightSidebar; 
window.updateRightPanel = loadRightMessages;
