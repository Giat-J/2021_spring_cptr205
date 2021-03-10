window.addEventListener('DOMContentLoaded', DOMContentLoaded => {
    
    // CREATING THE CANVAS
    const render = document.querySelector('canvas').getContext('2d'); 
    let w, h; 
    const resize = () => {
        w = render.canvas.width = render.canvas.clientWidth * window.devicePixelRatio; 
        h = render.canvas.height = render.canvas.clientHeight * window.devicePixelRatio; 
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
    }); 
    document.addEventListener('keyup', keyup => {
        if(keyup.key === 'ArrowRight') {
            arrow_right = false; 
        }
        if(keyup.key === 'ArrowLeft') {
            arrow_left = false; 
        }
    }); 

    // PLATFORM
    class Platform {
        constructor(x, y, w, h) {
            this.x = x; 
            this.y = y; 
            this.w = w; 
            this.h = h; 
        }
    }
    const platforms = []; 
    platforms.push(new Platform(-0.25, -0.25, 3, 0.25)); 
    platforms.push(new Platform(0.125, 0.25, 4, 0.125)); 
    
    // ANIMATION LOOP
    const animation = timestamp => {
        const PLAYER_ACCELERATION_X = 0.001; 
        if(arrow_right) {
            player_ax += PLAYER_ACCELERATION_X; 
        }
        if(arrow_left) {
            player_ax -= PLAYER_ACCELERATION_X; 
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
    
        render.save(); 
        render.translate(-player_x * w / 2, player_y * h / 2); 
        
        render.clearRect(player_x * w / 2, -player_y * h / 2, render.canvas.width, render.canvas.height); 

        //creating the green floor
        render.fillStyle = '#0f0'; 
        render.fillRect(-1000, render.canvas.height / 2, 10000 * render.canvas.width, render.canvas.height / 2); 

        //creating the blue sky
        render.fillStyle = '#0ff'; 
        render.fillRect(-1000 * w, 0, 10000 * render.canvas.width, render.canvas.height / 2); 
        
        render.fillStyle = '#00f'; 
        platforms.forEach(platform => {
            render.fillRect(platform.x * w / 2 + w / 2, -platform.y * h / 2 + h / 2, platform.w * w / 2, platform.h * h / 2); 
        }); 
        
        //creating the player, red ball
        render.fillStyle = '#f00'; 
        render.beginPath(); 
        render.arc(player_x * w / 2 + w / 2, -player_y * h / 2 + h / 2 - player_r * h / 2, player_r * h / 2, 0, 2 * Math.PI); 
        render.fill(); 
        
        render.restore(); 
        window.requestAnimationFrame(animation); 
    }; 
    window.requestAnimationFrame(animation); 
}); 