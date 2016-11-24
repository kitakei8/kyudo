var
  http = require('http'),
  express = require('express'),
  routes = require('./routes'),
  app = express(),
  server = http.createServer(app);

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname));
  app.use(app.router);
});


routes.configRoutes(app, server);

server.listen(3000);
console.log(
  'Express server listening on port %d in %s mode',
  server.address().port, app.settings.env
);
