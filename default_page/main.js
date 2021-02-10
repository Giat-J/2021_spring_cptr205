// WEBSOCKETS STUFF

const socket = new WebSocket('wss://southwestern.media/game_dev');

socket.addEventListener('open', open => {
    console.log('WEBSOCKETS OPENED'); 
}); 

socket.addEventListener('message', message => {
    const received = JSON.parse(message.data); 
    const received_game = received.Game; 
    const received_name = received.Name; 
    const received_message = JSON.parse(received.Message); 
    console.log(`GAME: ${received_game} | NAME: ${received_name} | MESSAGE: ${received_message}`); 
}); 

socket.addEventListener('close', close => {
    console.log('WEBSOCKETS CLOSED'); 
}); 

socket.addEventListener('error', error => {
    console.log('WEBSOCKETS ERROR'); 
}); 

// CANVAS STUFF
window.addEventListener('DOMContentLoaded', DOMContentLoaded => {
    const game = document.querySelector('canvas').getContext('2d'); 
    game.canvas.width = game.canvas.clientWidth; 
    game.canvas.height = game.canvas.clientHeight; 

    const animation_loop = () => {

        window.requestAnimationFrame(animation_loop); 
    }; 
    window.requestAnimationFrame(animation_loop); 
}); 