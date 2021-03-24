window.addEventListener('DOMContentLoaded', DOMContentLoaded => {

    // INITIALIZE WEBSOCKET
    const socket = new WebSocket('wss://southwestern.media/game_dev'); 
    socket.addEventListener('open', open => {
        console.log('WEBSOCKET STARTED'); 
    }); 
    
    // INITIALIZE CANVAS
    const render = document.querySelector('canvas').getContext('2d'); 
    const U_SCALE = 128; 
    let w, h, u; 
    const resize = () => {
        w = render.canvas.width = render.canvas.clientWidth * window.devicePixelRatio; 
        h = render.canvas.height = render.canvas.clientHeight * window.devicePixelRatio; 
        u = h / U_SCALE; 
            //TO PREVENT BLURRED IMAGES
        render.imageSmoothingEnabled = false; 
    }; 
    resize(); 
    window.addEventListener('resize', resize); 

    // INITIALIZE IMAGE
    const player_avatar = new Image(); 
    player_avatar.src = 'images/player_spritesheet.png'; 

    // PLAYER INPUT (EASIER METHOD)
    const movement = {ArrowRight: false, ArrowLeft: false, ArrowDown: false, ArrowUp: false}; 
    document.addEventListener('keydown', keydown => {
        if(movement.hasOwnProperty(keydown.key)) {
            movement[keydown.key] = true; 
        }
    }); 
    document.addEventListener('keyup', keyup => {
        if(movement.hasOwnProperty(keyup.key)) {
            movement[keyup.key] = false; 
        }
    }); 

    // ENEMIES
    const GAME = 'J.Giat_assignment_8_top_down_multiplayer'; 
    const NAME = Math.random().toString(); 
    const enemies = {}; 
    const send = message => {
        socket.send(JSON.stringify({Game: GAME, Name: NAME, Message: message})); 
    }; 
    socket.addEventListener('message', message => {
        const parsed = JSON.parse(message.data); 
        if(parsed.Game !== GAME || parsed.Name === NAME) {
            return; 
        }
        if(parsed.Message === 'goodbye') {
            console.log('GOODBYE'); 
            delete enemies[parsed.Name]; 
            return; 
        }
        enemies[parsed.Name] = JSON.parse(parsed.Message); 
    }); 
    const enemy_avatar = new Image(); 
    enemy_avatar.src = 'images/enemy.png'; 
    socket.addEventListener('beforeunload', beforeunload => {
        send('goodbye'); 
        beforeunload['returnValue'] = null; 
    }); 

    //PATTERNS
    const patterns = {}; 
    const crate = new Image(); 
    crate.src = 'images/crate.png'; 
    crate.addEventListener('load', load => {
        patterns.crate = render.createPattern(crate, 'repeat'); 
    }); 
    const rock = new Image(); 
    rock.src = 'images/rock.png'; 
    rock.addEventListener('load', load => patterns.rock = render.createPattern(rock, 'repeat'));

    // RIGID_BODY LOCATION & SIZE
    class Rigid_Body {
        constructor(x, y, w, h) {
            this.x = x; 
            this.y = y; 
            this.w = w; 
            this.h = h; 
        }
    }
    const rigid_bodies = []; 
    rigid_bodies.push(new Rigid_Body(50, 50, 32, 32)); 
    rigid_bodies.push(new Rigid_Body(128, 64, 32, 32)); 
    //OUTER WALLS
        //RIGHT WALL
    rigid_bodies.push(new Rigid_Body(253, -128, 3, 384)); 
        //LEFT WALL
    rigid_bodies.push(new Rigid_Body(-128, -128, 3, 384)); 
    //TOP WALL
    rigid_bodies.push(new Rigid_Body(-128, -128, 384, 3)); 
    //BOTTOM WALL
    rigid_bodies.push(new Rigid_Body(-128, 253, 384, 3)); 

    //COLLECTIBLE: BULLETS
    class Bullet {
        constructor(x, y) {
            this.x = x; 
            this.y = y; 
            this.w = 5; 
            this.h = 5;
        }
    }
    const bullets = [];
    //bullet co-ordinates
    bullets.push(new Bullet(50, 30));

    let ammo = 0;

    // ANIMATION LOOP
    //variables
    let frame_number = false;
        //TO PREVENT CONSTANTLY RENDERING 60FPS (PREVENTS TWITCHING MOTION)
    let frame_count = 0; 
        //TO PREVENT PLAYER SPRITE FROM RESETTING TO LEFT
    let player_direction = 0; 
        //SPRITE DIMENSIONS
    let x = 16, y = 16, r = 16; 
    const IMG_SIDE = 16; 
    const animation = timestamp => {
        
        // INITIALIZE ANIMATION
        frame_count++; 
        render.clearRect(0, 0, w, h); 
        render.fillRect(w / 2, h / 2, u, u); 
        render.save(); 
            //PLAYING AREA, PLACED HERE AND WITH w & h AS VARIABLES TO FILL ENTIRE PLAY AREA WITH SAME COLOR
        render.scale(u, u);
        render.fillStyle = patterns.rock; 
        render.fillRect(0, 0, w, h); 
            //CAMERA FUNCTION
        render.scale(u, u);
        render.translate(-Math.floor(x / U_SCALE) * U_SCALE, -Math.floor(y / U_SCALE) * U_SCALE); 
        
        
        // PLAYER PHYSICS
        let left = movement.ArrowLeft, right = movement.ArrowRight, up = movement.ArrowUp, down = movement.ArrowDown; 
        let vx = +right - +left; 
        let vy = +down - +up; 
        if(right || up || left || down) {
            //TERNARY OPERATOR(?) MAKES PLAYER ICON CHANGE IMAGE SIDE BASED ON MOVEMENT, SPRITESHEET SYNC: LEFT, RIGHT, UP, DOWN
            player_direction = right ? 1 : up ? 2 : down ? 3 : 0; 
            //THE NEW FPS SETTING (HIGHER NUMBER = SLOWER FRAME CHANGE)
            if(frame_count % 7 == 0) {
                //PLACED AFTER PLAYER DIRECTION SO THAT FRAME ONLY ANIMATES WHEN KEY IS HELD DOWN
                frame_number = !frame_number; 
            }
        }

        // COLLIDERS (IMPASSABLE OBJECT FUNCTION)
        rigid_bodies.forEach(rigid_body => {
            if(rigid_body.y <= y + IMG_SIDE && y < rigid_body.y + rigid_body.h) {
                if(x + IMG_SIDE <= rigid_body.x && rigid_body.x < x + IMG_SIDE + vx) {
                    vx = 0; 
                    x = rigid_body.x - IMG_SIDE; 
                }
                if(rigid_body.x + rigid_body.w <= x && x + vx < rigid_body.x + rigid_body.w) {
                    vx = 0; 
                    x = rigid_body.x + rigid_body.w; 
                }
            }
            if(rigid_body.x <= x + IMG_SIDE && x <= rigid_body.x + rigid_body.w) {
                if(y + IMG_SIDE <= rigid_body.y && rigid_body.y < y + IMG_SIDE + vy) {
                    vy = 0; 
                    y = rigid_body.y - IMG_SIDE; 
                }
                if(rigid_body.y + rigid_body.h <= y && y + vy < rigid_body.y + rigid_body.h) {
                    vy = 0; 
                    y = rigid_body.y + rigid_body.h; 
                }
            }
        }); 
        //COUNTERPART TO let vx = +right - +left; 
        //               let vy = +down - +up;
        x += vx; 
        y += vy; 
        if(vx || vy) {
            send(JSON.stringify({x: x, y: y})); 
        }
        //Creating the bullets & detecting / handling collisions
        render.fillStyle = '#000';
        bullets.forEach((bullet, i) => {
            const bx = bullet.x + bullet.w / 2, by = bullet.y - bullet.h / 2;
            const px = x + r / 2, py = y + r / 2;
            if(Math.sqrt(Math.pow(px - bx, 2) + Math.pow(py - by, 2)) * u < r / 2 * u) {
                //deleting the bullet
                bullets.splice(i, 1);
                ammo++;
                return;
            }
            render.fillRect(bullet.x * u, bullet.y * u, bullet.w * u, bullet.h * u)
        });

        // RENDER DYNAMIC OBJECTS
        //RENDERING ALL RIGID BODIES
        render.fillStyle = patterns.crate; 
        rigid_bodies.forEach(rigid_body => {
            render.fillRect(rigid_body.x, rigid_body.y, rigid_body.w, rigid_body.h); 
        });
        //ENEMIES 
        Object.values(enemies).forEach(enemy => {
        
            render.drawImage(enemy_avatar, 0, 0, IMG_SIDE, IMG_SIDE, enemy.x, enemy.y, IMG_SIDE, IMG_SIDE); 
            if(enemy.x < x + IMG_SIDE && x < enemy.x + IMG_SIDE && enemy.y < y + IMG_SIDE && y < enemy.y) {
                console.log('COLLISION'); 
            //RENDER PLAYER
            }
        }); 
    }); 
    render.drawImage(player_avatar, +frame_number * IMG_SIDE, player_direction * IMG_SIDE, IMG_SIDE, IMG_SIDE, x, y, IMG_SIDE, IMG_SIDE); 

    render.restore(); 
    //SHOWING AMMO PICKED UP
    render.fillStyle = '#000';
    render.font = 'bold 64px arial';
    render.fillText(`${ammo} AMMO`, 50, 114);
    
    window.requestAnimationFrame(animation); 
}; 
window.requestAnimationFrame(animation); 
}); 
