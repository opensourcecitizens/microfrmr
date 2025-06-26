const args = require('minimist')(process.argv.slice(2));
const port = args['port'] || 9090;

var connect = require('connect');
var serveStatic = require('serve-static');

connect()
  .use(serveStatic(__dirname))
  //.use(serveStatic('public'))
  .listen(port,() => console.log('Server running on '+port+' ...'));
