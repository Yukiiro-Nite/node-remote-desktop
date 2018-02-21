const Path = require('path');
const robotService = require('../src/js/robotProcess');
const actionBuilder = require('../src/js/actionBuilder');

exports.config = {
  routes: {
    get: {
      '/socket.io.js': (req, res) => {
        const path = Path.resolve(__dirname, '../node_modules/socket.io-client/dist/socket.io.js');
        res.sendFile(path);
      },
      '/screen.gif': (req, res) => {
        const path = Path.resolve(__dirname, '../screen.gif');
        res.sendFile(path);
      }
    }
  },
  socketEvents: {
    connection(io, socket) {
      console.log('User Connected');
      robotService.javaOutput.on('line', (input) => {
        const inputObject = JSON.parse(input);
        socket.emit(inputObject.type, inputObject);
      });
      console.log(robotService.screenSize);
      socket.emit('screen-size', robotService.screenSize);
    },
    event(io, socket, msg) {
      robotService.write(actionBuilder(msg));
    },
    disconnect() {
      console.log('User Disconnected');
    }
  }
};
