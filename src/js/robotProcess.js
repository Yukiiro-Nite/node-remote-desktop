const { spawn } = require('child_process');
const readline = require('readline');
const objectSerialize = require('./objectSerializer.js');
const robotService = spawn('java', [
  '-cp',
  './src/java/build',
  'RobotService'
]);

// robotService.stdout.on('data', (data) => {
//   process.stdout.write(data);
// });

const fromRobot = readline.createInterface({ input: robotService.stdout });

fromRobot.on('line', (input) => {
  console.log(`Received: ${input}`);
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
  write: (obj) => robotService.stdin.write(objectSerialize(obj))
};
