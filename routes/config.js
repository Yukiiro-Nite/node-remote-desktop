// const robot = require('robotjs');
const Path = require('path');
// const screenSize = robot.getScreenSize();
const robotService = require('../src/js/robotProcess');
const actionBuilder = require('../src/js/actionBuilder');

function getScreen() {
  // const capture = robot.screen.capture();
  return {};
  //   image: capture.image,
  //   width: capture.width,
  //   height: capture.height
  // };
}

exports.config = {
  routes: {
    get: {
      '/socket.io.js': (req, res) => {
        const path = Path.resolve(__dirname, '../node_modules/socket.io-client/dist/socket.io.js');
        res.sendFile(path);
      }
    }
  },
  socketEvents: {
    connection(io, socket) {
      console.log('User Connected');
      socket.emit('screen-size', screenSize);
      socket.emit('screen', getScreen());
    },
    event(io, socket, msg) {
      robotService.write(actionBuilder(msg));
      socket.emit('screen', getScreen());
    },
    disconnect() {
      console.log('User Disconnected');
    }
  }
};
