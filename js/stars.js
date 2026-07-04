/* ==========================================================
                    STARS.JS
        Анимированный фон + параллакс эффект
==========================================================*/


const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;


/* ==========================================================
                    НАСТРОЙКИ
==========================================================*/

const STAR_COUNT = 300; // количество звёзд

const stars = [];


/* ==========================================================
                    СОЗДАНИЕ ЗВЁЗД
==========================================================*/

function createStars(){

    stars.length = 0;

    for(let i = 0; i < STAR_COUNT; i++){

        stars.push({

            x: Math.random() * width,

            y: Math.random() * height,

            radius: Math.random() * 1.6,

            alpha: Math.random(),

            speed: 0.002 + Math.random() * 0.01,

            direction: Math.random() > 0.5 ? 1 : -1,

            depth: Math.random() * 1.5 + 0.2

        });

    }

}


/* ==========================================================
                    RESIZE
==========================================================*/

function resize(){

    width = canvas.width = window.innerWidth;

    height = canvas.height = window.innerHeight;

    createStars();

}

window.addEventListener("resize", resize);


/* ==========================================================
                    МЫШЬ (параллакс)
==========================================================*/

let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (e) => {

    mouseX = (e.clientX - width / 2) / 60;

    mouseY = (e.clientY - height / 2) / 60;

});


/* ==========================================================
                    АНИМАЦИЯ
==========================================================*/

function animate(){

    ctx.clearRect(0, 0, width, height);


    for(const star of stars){

        /* мерцание */

        star.alpha += star.speed * star.direction;

        if(star.alpha >= 1){

            star.alpha = 1;

            star.direction = -1;

        }

        if(star.alpha <= 0.1){

            star.alpha = 0.1;

            star.direction = 1;

            // лёгкий "телепорт" звезды
            star.x = Math.random() * width;

            star.y = Math.random() * height;

        }


        /* параллакс */

        const x = star.x + mouseX * star.depth;

        const y = star.y + mouseY * star.depth;


        /* отрисовка */

        ctx.beginPath();

        ctx.arc(x, y, star.radius, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;

        ctx.fill();

    }


    requestAnimationFrame(animate);

}


/* ==========================================================
                    INIT
==========================================================*/

createStars();

animate();// stars.js