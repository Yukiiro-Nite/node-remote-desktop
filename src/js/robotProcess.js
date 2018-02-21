const { spawn } = require('child_process');
const readline = require('readline');
const objectSerialize = require('./objectSerializer.js');
const robotService = spawn('java', [
  '-cp',
  './src/java/build',
  'RobotService'
]);
const fromRobot = readline.createInterface({ input: robotService.stdout });
let screenSize = { height: 0, width: 0 };

fromRobot.on('line', (input) => {
  console.log(`Received: ${input}`);
  input = JSON.parse(input);
  switch(input.type) {
    case 'screen-size':
      screenSize.height = input.height;
      screenSize.width = input.width;
      break;
  }
});

robotService.stderr.on('data', (data) => {
  process.stdout.write(data);
});

robotService.on('close', (code) => {
  console.log(`robot process exited with code ${code}`);
});

process.on('exit', () => {
  fromRobot.close();
  robotService.kill();
});

module.exports = {
  write: (obj) => robotService.stdin.write(objectSerialize(obj)),
  javaOutput: fromRobot,
  screenSize
};
