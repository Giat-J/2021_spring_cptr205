window.addEventListener('DOMContentLoaded', DOMContentLoaded => {

    // INITIALIZE CANVAS
    const render = document.querySelector('canvas').getContext('2d'); 
    const U_SCALE = 128; 
    let w, h, u; 
    const resize = () => {
        w = render.canvas.width = render.canvas.clientWidth * window.devicePixelRatio; 
        h = render.canvas.height = render.canvas.clientHeight * window.devicePixelRatio; 
        u = h / U_SCALE; 
        render.imageSmoothingEnabled = false; 
    }; 
    resize(); 
    window.addEventListener('resize', resize); 

    // INITIALIZE IMAGE
    const player_avatar = new Image(); 
    player_avatar.src = 'images/player_spritesheet.png'; 

    // PLAYER INPUT
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

    // RIGID_BODY
    class Rigid_Body {
        constructor(x, y, w, h) {
            this.x = x; 
            this.y = y; 
            this.w = w; 
            this.h = h; 
        }
    }
    const rigid_bodies = []; 
    rigid_bodies.push(new Rigid_Body(64, 64, 32, 40)); 

    // ANIMATION LOOP
    let frame_number = false; 
    let frame_count = 0; 
    let player_direction = 0; 
    let x = 16, y = 16; 
    const IMG_SIDE = 16; 
    const animation = timestamp => {
        
        // INITIALIZE ANIMATION
        frame_count++; 
        render.clearRect(0, 0, w, h); 
        render.fillRect(w / 2, h / 2, u, u); 
        render.save(); 
        render.fillStyle = '#080'; 
        render.fillRect(0, 0, w, h); 
        render.translate(-Math.floor(x / U_SCALE) * w, -Math.floor(y / U_SCALE) * h); 
        
        // PLAYER PHYSICS
        let left = movement.ArrowLeft, right = movement.ArrowRight, up = movement.ArrowUp, down = movement.ArrowDown; 
        let vx = +right - +left; 
        let vy = +down - +up; 
        if(right || up || left || down) {
            player_direction = right ? 1 : up ? 2 : down ? 3 : 0; 
            if(frame_count % 10 == 0) {
                frame_number = !frame_number; 
            }
        }

        // COLLIDERS
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
        x += vx; 
        y += vy; 
        
        // RENDER DYNAMIC OBJECTS
        render.fillStyle = '#aaa'; 
        rigid_bodies.forEach(rigid_body => {
            render.fillRect(rigid_body.x * u, rigid_body.y * u, rigid_body.w * u, rigid_body.h * u); 
        }); 
        render.drawImage(player_avatar, +frame_number * IMG_SIDE, player_direction * IMG_SIDE, IMG_SIDE, IMG_SIDE, x * u, y * u, IMG_SIDE * u, IMG_SIDE * u); 

        render.restore(); 
        window.requestAnimationFrame(animation); 
    }; 
    window.requestAnimationFrame(animation); 
}); 