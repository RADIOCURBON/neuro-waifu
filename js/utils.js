
/* ==========================================================
                    БЫСТРЫЙ ПОИСК ЭЛЕМЕНТА
==========================================================*/

function $(selector){

    return document.querySelector(selector);

}


function $$(selector){

    return document.querySelectorAll(selector);

}


/* ==========================================================
                    СОЗДАНИЕ ЭЛЕМЕНТА
==========================================================*/

function createElement(tag, className = ""){

    const element = document.createElement(tag);

    if(className){

        element.className = className;

    }

    return element;

}


/* ==========================================================
                    СЛУЧАЙНОЕ ЧИСЛО
==========================================================*/

function random(min, max){

    return Math.random() * (max - min) + min;

}


/* ==========================================================
                    ОГРАНИЧЕНИЕ ЧИСЛА
==========================================================*/

function clamp(value, min, max){

    return Math.min(Math.max(value, min), max);

}


/* ==========================================================
                    ЗАДЕРЖКА
==========================================================*/

function sleep(ms){

    return new Promise(resolve => setTimeout(resolve, ms));

}


/* ==========================================================
                    UUID
==========================================================*/

function generateId(){

    return Date.now().toString(36) +

           Math.random().toString(36).substring(2, 8);

}


/* ==========================================================
                    ТЕКУЩЕЕ ВРЕМЯ
==========================================================*/

function getCurrentTime(){

    const now = new Date();

    return now.toLocaleTimeString("ru-RU",{

        hour:"2-digit",

        minute:"2-digit"

    });

}


/* ==========================================================
                    ТЕКУЩАЯ ДАТА
==========================================================*/

function getCurrentDate(){

    const now = new Date();

    return now.toLocaleDateString("ru-RU");

}


/* ==========================================================
                    ПРОКРУТКА ВНИЗ
==========================================================*/

function scrollToBottom(element){

    if(!element){

        return;

    }

    element.scrollTop = element.scrollHeight;

}


/* ==========================================================
                    DEBOUNCE
==========================================================*/

function debounce(callback, delay = 300){

    let timeout;

    return (...args)=>{

        clearTimeout(timeout);

        timeout = setTimeout(()=>{

            callback(...args);

        }, delay);

    };

}


/* ==========================================================
                    THROTTLE
==========================================================*/

function throttle(callback, delay = 100){

    let waiting = false;

    return (...args)=>{

        if(waiting){

            return;

        }

        callback(...args);

        waiting = true;

        setTimeout(()=>{

            waiting = false;

        }, delay);

    };

}


/* ==========================================================
                    КОПИРОВАНИЕ ТЕКСТА
==========================================================*/

async function copyText(text){

    try{

        await navigator.clipboard.writeText(text);

        return true;

    }

    catch{

        return false;

    }

}


/* ==========================================================
                    ПРОВЕРКА ПУСТОЙ СТРОКИ
==========================================================*/

function isEmpty(text){

    return text.trim().length === 0;

}


/* ==========================================================
                    ЭКРАННЫЕ РАЗМЕРЫ
==========================================================*/

function isMobile(){

    return window.innerWidth <= 768;

}


function isTablet(){

    return window.innerWidth > 768 && window.innerWidth <= 1024;

}


function isDesktop(){

    return window.innerWidth > 1024;

}
function typeText(element, text, speed = 20) {
    let i = 0;
    element.value = "";

    const interval = setInterval(() => {
        element.value += text[i];
        i++;
        if (i >= text.length) clearInterval(interval);
    }, speed);
}