let canvas = document.querySelector('.canvas'); 

let context = canvas.getContext('2d'); 

context.fillRect(75, 75, 10, 10);

document.addEventListener('keydown', keydown => {
    if(keydown.key === 'c') {
    context.clearRect(0, 0, canvas.width, canvas.height)
    }
});

canvas.addEventListener('click', click => {
    context.clearRect(0, 0, canvas.width, canvas.height)

    var cr = 'rgb('+
      Math.floor(Math.random()*256)+','+
      Math.floor(Math.random()*256)+','+
      Math.floor(Math.random()*256)+')';

    context.fillStyle = cr
    context.fillRect(Math.floor(Math.random() * 101), Math.floor(Math.random() * 101), Math.floor(Math.random() * 101), Math.floor(Math.random() * 101)
    )
});

