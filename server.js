const expressStarter = require('express-starter');

expressStarter.start(5353, (express, app, io) => {
  app.use(express.static('./client'));
});
