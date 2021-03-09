let canvas = document.querySelector('.canvas'); 

let context = canvas.getContext('2d'); 
canvas.width = canvas.clientWidth;
cancas.height = canvas.clientHeight;

context.fillRect(75, 75, 10, 10);

document.addEventListener('keydown', keydown => {
    if(keydown.key === 'c') {
    context.clearRect(0, 0, canvas.width, canvas.height)
    }
});

let rect_x = 75;
let rect_y = 75;
let random_width = 10;
let random_height = 10;
canvas.addEventListener('click', click => {
  
  let cr = 'rgb('+
  Math.floor(Math.random()*256)+','+
  Math.floor(Math.random()*256)+','+
  Math.floor(Math.random()*256)+')';
  
  context.fillStyle = cr

  if(rect_x <= click.clientX <= rect_x + random_width)
  context.clearRect(0, 0, canvas.width, canvas.height)

    context.fillRect(Math.floor(Math.random() * 101), Math.floor(Math.random() * 101), Math.floor(Math.random() * 101), Math.floor(Math.random() * 101)
    )
});

