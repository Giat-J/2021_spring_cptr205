window.addEventListener('DOMContentLoaded', DOMContentLoaded => {
    //THINGS TO ADD
    //ENEMY
    //COLLECTIBLES
    //GOAL CONDITION
    //LOSS CONDITION
    //NEW GAME SCREEN

    // CREATING THE CANVAS
    const render = document.querySelector('canvas').getContext('2d'); 
    let w, h, unit;; 
    const resize = () => {
        //render canvas width & height shortened to w and h variables for ease of typing
        w = render.canvas.width = render.canvas.clientWidth * window.devicePixelRatio; 
        h = render.canvas.height = render.canvas.clientHeight * window.devicePixelRatio; 
        unit = h / 2
    }; 
    // CALLING THE RESIZE FUNCTION
    resize(); 
    window.addEventListener('resize', resize); 

    // APPLY PHYSICS
    //SPAWN POSITION
    let player_x = 0, player_y = 0; 
    // player radius
    let player_r = 0.2; 
    //player x & y-axis velocity & acceleration
    let player_vx = 0, player_vy = 0; 
    let player_ax = 0, player_ay = 0; 
    let arrow_right = false; 
    let arrow_left = false; 
    let keydownR = false;
    document.addEventListener('keydown', keydown => {
        if(keydown.key === 'ArrowRight') {
            arrow_right = true; 
        }
        if(keydown.key === 'ArrowLeft') {
            arrow_left = true; 
        }
        if(keydown.key === 'ArrowUp') {
            player_ay += 0.01; 
        }
        if(keydown.key === 'r') {
            keydownR = true;
        }
    }); 
    //to stop acceleration process?
    document.addEventListener('keyup', keyup => {
        if(keyup.key === 'ArrowRight') {
            arrow_right = false; 
        }
        if(keyup.key === 'ArrowLeft') {
            arrow_left = false; 
        }
        if(keyup.key === 'r') {
            keydownR = false;
        }
    }); 

    // PLATFORM
    class Platform {
        constructor(x, y, w, h) {
            //fancy variable?? Class?
            this.x = x; 
            this.y = y; 
            this.w = w; 
            this.h = h; 
        }
    }
    //Array?
    const platforms = []; 
    //platform positions
    platforms.push(new Platform(-0.25, -0.25, 3, 0.25)); 
    platforms.push(new Platform(0.125, 0.25, 4, 0.125)); 
    
    //COIN Function
    class Coin {
        constructor(x, y) {
            this.x = x; 
            this.y = y; 
            this.w = 0.1; 
            this.h = 0.1;
        }
    }
    const coins = []
    //coin co-ordinates
    coins.push(new Coin(0.25, 0.5));
    coins.push(new Coin(0.5, 0.5));
    coins.push(new Coin(0.75, 0.5));
    coins.push(new Coin(1, 0.5));
    coins.push(new Coin(3.25, 0.5));
    coins.push(new Coin(3.5, 0.5));
    coins.push(new Coin(3.75, 0.5));
    coins.push(new Coin(4, 0.5));
    //ground level coins
    coins.push(new Coin(2, 0));
    coins.push(new Coin(2.25, 0));
    coins.push(new Coin(2.5, 0));
    //high coins
    coins.push(new Coin(2, 1));
    coins.push(new Coin(2.25, 1.25));
    coins.push(new Coin(2.5, 1));

    let points = 0;
    let won;

    // ANIMATION LOOP
    const animation = timestamp => {
        //unclear on what this variable is for
        //moved above "camera" or translate function
        const PLAYER_ACCELERATION_X = 0.001; 
        if(!won){
            if(arrow_right) {
                player_ax += PLAYER_ACCELERATION_X; 
            }
            if(arrow_left) {
                player_ax -= PLAYER_ACCELERATION_X; 
            }
        }
        player_vx += player_ax; 
        player_x += player_vx; 
        player_ax = 0; 
        //key part of the slowing down function
        player_vx *= 0.98; 
        //jump function
        player_vy += player_ay; 
        //fall function
        player_ay -= 0.00098; 
        
        //revised "landing" function to include landing on platforms
        let player_grounded = false; 
        platforms.forEach(platform => {
            if(platform.x <= player_x && player_x <= platform.x + platform.w && platform.y <= player_y && player_y + player_vy <= platform.y) {
                player_grounded = true; 
                player_ay = 0; 
                player_vy = 0; 
                player_y = platform.y; 
                return; 
            }
        }); 
        if(!player_grounded) {
            player_y += player_vy; 
        }
        //reset after fall
        if(player_y < -30 || keydownR) {
            coins.splice(0,coins.length)
            player_y = 0;
            player_x = 0;
            points = 0;
            coins.push(new Coin(0.25, 0.5));
            coins.push(new Coin(0.5, 0.5));
            coins.push(new Coin(0.75, 0.5));
            coins.push(new Coin(1, 0.5));
            coins.push(new Coin(3.25, 0.5));
            coins.push(new Coin(3.5, 0.5));
            coins.push(new Coin(3.75, 0.5));
            coins.push(new Coin(4, 0.5));
            coins.push(new Coin(2, 0));
            coins.push(new Coin(2.25, 0));
            coins.push(new Coin(2.5, 0));
            coins.push(new Coin(2, 1));
            coins.push(new Coin(2.25, 1.25));
            coins.push(new Coin(2.5, 1));

            won = false
        }

        
        //RENDER INIT
        render.save(); 

        render.clearRect(0,0, render.canvas.width, render.canvas.height); 
        
        //creating the green floor
        render.fillStyle = '#0f0'; 
        render.fillRect(0, render.canvas.height / 2, w, render.canvas.height / 2); 
        
        //creating the blue sky
        render.fillStyle = '#0ff'; 
        render.fillRect(0, 0, w, render.canvas.height / 2); 
        
        //to make the "camera" follow the player to space initially unseen
        //need some more thought on the maths of this equation
        render.translate(-player_x * unit, player_y * unit); 
        
        //Creating the blue platform (shape only)
        render.fillStyle = '#00f'; 
        platforms.forEach(platform => {
            render.fillRect(platform.x * unit + w / 2, -platform.y * unit + unit, platform.w * unit, platform.h * unit); 
        }); 
        
        //Creating the coins & detecting / handling collisions
        render.fillStyle = '#ff0';
        coins.forEach((coin, i) => {
            const cx = coin.x + coin.w / 2, cy = coin.y - coin.h / 2;
            const px = player_x, py = player_y + player_r;
            if(Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2)) * unit < player_r * unit) {
                //deleting the coin
                coins.splice(i, 1);
                points++;
                return;
            }
            render.fillRect(coin.x * unit + w / 2, -coin.y * unit + unit, coin.w * unit, coin.h * unit)
        })
        
        //creating the player, red ball
        render.fillStyle = '#f00'; 
        render.beginPath(); 
        //y-axis added "-player_r * h /2" to change center point to bottom of circle?
        render.arc(player_x * unit + w / 2, -player_y * unit + unit - player_r * unit, player_r * unit, 0, 2 * Math.PI); 
        render.fill(); 
        
        //counterpart to render.save 
        render.restore(); 
        
        //DRAWING POINTS
        render.fillStyle = '#000';
        render.font = 'bold 64px arial';
        render.fillText(`${points} POINTS`, 50, 114);

        //win condition
        if(points >= 14) {
            won = true
            render.fillStyle ='#0f0'
            render.fillRect(0, 0, w, h)
            render.fillStyle = '#000';
            render.fillText('YOU WIN!!', w / 2, h / 2);
        }

        window.requestAnimationFrame(animation); 
    }; 
    window.requestAnimationFrame(animation); 
}); 