// GAME DEV TEXT
// This is basically a simple text/chat frontend that will use the same techniques we'll use for games.  

// This is the address that we're connecting to.  
// At that address, there's a server that connects everyone who has joined the game.  
const socket = new WebSocket('wss://southwestern.media/game_dev');

// This is an "event listener".  It runs the interior commands each time you get a message (as managed by the websocket server).  
socket.addEventListener('open', open => {
    document.querySelector('.chat-stream').innerText += 'WEBSOCKETS OPENED\n'
}); 

socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    document.querySelector('.chat-stream').innerText += message.Game + ' :: ' + message.Name.toUpperCase() + ' >> ' + message.Message + '\n';
}); 

const write_closed = () => {
    document.querySelector('.chat-stream').innerText += 'WEBSOCKETS CLOSED\n'; 
}; 
socket.addEventListener('close', write_closed); 
socket.addEventListener('error', write_closed); 

// This sends your message to the websocket server.  
// Our messages are pretty simple: they'll just have a game (the name of your game, to distinguish it from other games), a name (the name of the player), and a message which can be anything.  
// Deciding what type of messages you want to send is entirely up to you.  
document.querySelector('#submit').addEventListener('click', () => {
    socket.send(JSON.stringify({
        Game: document.querySelector('#game').value, 
        Name: document.querySelector('#name').value, 
        Message: document.querySelector('#message').value
    })); 
    document.querySelector('#message').value = ''; 
});

// This just sends a message when you press return.  
document.addEventListener('keyup', function(event) {
    if(event.key === 'Enter') {
        event.preventDefault();
        document.getElementById("submit").click();
    }
}); 