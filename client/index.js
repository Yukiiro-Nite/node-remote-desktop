const socket = io();
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

socket.on('screen-size', (msg) => {
  canvas.width = msg.width;
  canvas.height = msg.height;
});

socket.on('screen', (msg) => {
  // do something to set the canvas to the image of the screen
  const backCanvas = document.createElement('canvas');
  const backContext = backCanvas.getContext('2d');
  backCanvas.width = msg.width;
  backCanvas.height = msg.height;

  const rawData = new Uint8ClampedArray(msg.image);
  const imageData = new ImageData(rawData, msg.width, msg.height);
  backContext.putImageData(imageData, 0, 0);
  context.drawImage(backCanvas, 0, 0, canvas.width, canvas.height);
});

canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('keydown', handleKeyDown);
canvas.addEventListener('keyup', handleKeyUp);

function handleMouseMove(event) {
  socket.emit('event', {
    type: 'mousemove',
    x: event.offsetX,
    y: event.offsetY
  });
}

function handleMouseDown(event) {
  socket.emit('event', {
    type: 'mousedown',
    x: event.offsetX,
    y: event.offsetY,
    key: event.button
  });
}

function handleMouseUp(event) {
  socket.emit('event', {
    type: 'mouseup',
    x: event.offsetX,
    y: event.offsetY,
    key: event.button
  });
}

function handleKeyDown(event) {
  socket.emit('event', {
    type: 'keydown',
    key: event.keyCode
  });
}

function handleKeyUp(event) {
  socket.emit('event', {
    type: 'keyup',
    key: event.keyCode
  });
}
