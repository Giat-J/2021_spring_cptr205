window.addEventListener('DOMContentLoaded', DOMContentLoaded => {

// WEBSOCKET STUFF
const ws = new WebSocket('wss://southwestern.media/game_dev');
ws.addEventListener('open', open => {
console.log('WEBSOCKET CONNECTION OPENED');
const data = {};
data.Game = 'J.Giat_Assignment_3';
const our_name = data.Name = Math.random().toString();
const our_message = {};
our_message.Text = 'Hello there, General Kenobi';
our_message.Arbitrary = 'washallam';
data.Message = JSON.stringify(our_message);
    ws.send(JSON.stringify(data));

});
ws.addEventListener('close', close => {
    console.log('WEBSOCKETS CLOSED');
});
    ws.addEventListener('error', error => {
console.log('WEBSOCKETS ERROR')
    });
    ws.addEventListener('message', message => {
        console.log('WEBSOCKETS MESSAGE:', message)
    });

    const incoming_message = JSON.parse(message.data);
    if(incoming_message.Game !== our_game); {
    return;
    }
    game_events = JSON.parse(incoming_message.Message);

// 2D CANVAS STUFF
    const game = document.querySelector('canvas').getContext('2d');
    const resize_canvas = () => {
game.canvas.width = game.canvas.clientWidth;
game.canvas.height = game.canvas.clientHeight;

// game.canvas.width = game.canvas.clientWidth * window.devicePixelRatio;
// game.canvas.height = game.canvas.clientHeight * window.devicePixelRatio;
};
resize_canvas();
window.addEventListener('resize', resize_canvas);

let r_y = 0;
const render = () => {
    game.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.filStyle = '#00F';
    game.fillRect(0, r_y, game.canvas.width, game.canvas.height / 2);

    game.lineWidth = 20;
    game.strokeRect(game.canvas.width / 2, r_y, game.canvas.width / 2, game.canvas.height / 2)

    game.strokeStyle = '#0F0';
    game.lineCap = 'round';
    game.beginPath();
    game.moveTo(3 * game.canvas.width / 4, game.canvas.height / 4);
    game.lineTo(3 * game.canvas.width / 4, game.canvas.height / 4);
    game.stroke();
    game.restore();

    game.lineCap = 'round';
    game.beginPath();
    game.moveTo(3 * game.canvas.width / 4, 3 * game.canvas.height / 4);
    game.lineTo(3 * game.canvas.width / 4, 3 * game.canvas.height / 4);
    game.stroke();
    game.restore();
    
    window.requestAnimationFrame(render);
};
window.requestAnimationFrame(render);
});

