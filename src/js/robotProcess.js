const { spawn } = require('child_process');
const objectSerialize = require('./objectSerializer.js');
const robotService = spawn('java', [
  '-cp',
  './src/java/build',
  'RobotService'
]);

robotService.stdout.on('data', (data) => {
  process.stdout.write(data);
});

robotService.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

robotService.on('close', (code) => {
  console.log(`robot process exited with code ${code}`);
});

process.on('exit', () => {
  robotService.kill();
});

module.exports = {
  write: (obj) => robotService.stdin.write(objectSerialize(obj))
};
