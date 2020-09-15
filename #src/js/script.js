// import { randomBytes } from "crypto";

// function testWebP(callback) {

//     var webP = new Image();
//     webP.onload = webP.onerror = function () {
//         callback(webP.height == 2);
//     };
//     webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
// }

// testWebP(function (support) {

//     if (support == true) {
//         document.querySelector('body').classList.add('webp');
//     } else {
//         document.querySelector('body').classList.add('no-webp');
//     }
// });
// Самовызывающаяся функция
(() => {
    const config = {
        dotMinRad : 6 ,
        dotMaxRad : 20 ,
        bigDotRad : 35,
        massFactor : 0.002,
        defColor : 'rgba(250 , 10 , 30 , 0.9)',
        smooth  : 0.65,
        sphereRad : 300,
        mouseSize : 120,
    }
    
    const TWO_PI = 2 * Math.PI;
    // вызываем Canvas
    // const canvas = document.querySelector('canvas');
    const canvas = document.getElementById('canvas');
    const ctx    = canvas.getContext('2d');

    // хранение высоты и ширины
    let w,h,mouse, dots;

    class Dot {
        constructor(r){
            // координаты мыши
            this.pos = {x: mouse.x, y: mouse.y} 
            // скорость
            this.vel = {x:0,y:0};
            // параметры круга (радиус)
            this.rad = r || random(config.dotMinRad, config.dotMaxRad);
            // масса 
            this.mass = this.rad * config.massFactor;
            // цвет окружности
            this.color = config.defColor;
            
        }
        
        draw(x,y) {
            this.pos.x = x || this.pos.x + this.vel.x;
            this.pos.y = y || this.pos.y +  this.vel.y;
            createCircle(this.pos.x , this.pos.y, this.rad, true, this.color)
            createCircle(this.pos.x , this.pos.y, this.rad, false, config.defColor)
            
        }
    }

    function updateDots(){
        for (let i = 1; i < dots.length; i++) {
            let acc = {x:0, y:0};
            for (let j = 0; j < dots.length; j++){
                if (i ==j) continue;
                let [a,b] = [dots[i], dots[j]];

                let delta = {x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y};
                let dist = Math.sqrt( delta.x * delta.x + delta.y * delta.y) || 5;
                let force = (dist - config.sphereRad) / dist *  b.mass;

                if (j ==0) {
                    let alpha = config.mouseSize / dist;
                    a.color = `rgba(250 , 10 , 30 , ${alpha}$)`;
                    dist < config.mouseSize ? force = (dist - config.mouseSize) * b.mass : force = a.mass;
                }

                acc.x += delta.x * force;
                acc.y += delta.y * force;
            }

            dots[i].vel.x = dots[i].vel.x * config.smooth + acc.x * dots[i].mass;
            dots[i].vel.y = dots[i].vel.y * config.smooth + acc.y * dots[i].mass;
        }
        dots.map(e => e == dots[0] ? e.draw(mouse.x, mouse.y) : e.draw());
    }

    function createCircle(x,y,rad,fill,color){
        ctx.fillStyle = ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x,y,rad,0,TWO_PI);
        ctx.closePath();
        fill ? ctx.fill() : ctx.stroke();
    }

    // Получаем рандомный радиус
    function random(min,max){
        return Math.random()*(max - min) + min;
    }

    // Задаем ширину и высоту
    function init(){ 
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;

        mouse = {x: w / 2, y: h / 2, down:false}

        dots = [];
        dots.push(new Dot(config.bigDotRad))
    }

    function loop(){
        ctx.clearRect(0,0,w,h);
        // console.log(w,h);
        if(mouse.down){ dots.push(new Dot());}

        updateDots();
        // dots.map(e => e.draw());

        window.requestAnimationFrame(loop);

        // console.log(mouse)
    }

    // инициализируем
    init();
    loop();

    

    function isDown () {
        mouse.down = !mouse.down;
    }

    // считываем положение мыши
    // canvas.addEventListener('mousemove', setPos);
    canvas.addEventListener('mousemove', e => {
        x = e.offsetX;
        y = e.offsetY;
        [mouse.x, mouse.y] = [x, y];
        // console.log(mouse.x, mouse.y)
    });
    window.addEventListener('mousedown', isDown);
    window.addEventListener('mouseup', isDown);
})();