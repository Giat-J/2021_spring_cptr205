window.addEventListener('DOMContentLoaded', DOMContentLoaded => {
  
    // CREATING THE CANVAS
    const render = document.querySelector('canvas').getContext('2d'); 
    const resize = () => {
        render.canvas.width = render.canvas.clientWidth * window.devicePixelRatio; 
        render.canvas.height = render.canvas.clientHeight * window.devicePixelRatio; 
    }; 
    //CALLING THE RESIZE FUNCTION
    resize(); 
    window.addEventListener('resize', resize); 

    // APPLY PHYSICS
    let player_x = 0, player_y = 0; 
    //player radius
    let player_r = 0.2; 
    //player x & y-axis velocity & acceleration
    let player_vx = 0, player_vy = 0; 
    let player_ax = 0, player_ay = 0;
    document.addEventListener('keydown', keydown => {
        if(keydown.key === 'ArrowRight') {
            player_ax += 0.01;  
        }
        if(keydown.key === 'ArrowLeft') {
            player_ax -= 0.01; 
        }
        if(keydown.key === 'ArrowUp') {
            player_ay += 0.01;
        }
    }); 
    
    // ANIMATION LOOP
    const animation = timestamp => {
        render.clearRect(0, 0, render.canvas.width, render.canvas.height);
        //creating the green floor
        render.fillStyle = '#0f0'; 
        render.fillRect(0, render.canvas.height / 2, render.canvas.width, render.canvas.height / 2); 
        //creating the blue sky
        render.fillStyle = '#0ff'; 
        render.fillRect(0, 0, render.canvas.width, render.canvas.height / 2); 
        //creating the player, red ball
        render.fillStyle = '#f00'; 
        render.beginPath(); 
        const w = render.canvas.width, h = render.canvas.height
        
        player_vx += player_ax;
        player_x += player_vx; 
        player_ax = 0;
        //key part of the slowing down function
        player_vx *= 0.98 
        //Jump function
        player_vy += player_ay;
        player_y += player_vy;
        if(0 < player_y) {
            //fall function
        player_ay -= 0.00098;
        } else {
            //stopping on "land"
            player_ay = 0;
            player_vy = 0;
            player_y = 0;
        }
    
        //the addition bit is kind of unclear still
        render.arc(player_x * w / 2 + w / 2, -player_y * h / 2 + h / 2, player_r * w / 2, 0, 2 * Math.PI); 
        render.fill(); 

        
        window.requestAnimationFrame(animation); 
    }; 
    window.requestAnimationFrame(animation); 
}); 