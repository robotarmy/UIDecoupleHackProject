var Ledger = require('./Ledger').Ledger;
var http = require('http');
var sys = require('sys');

var server = http.createServer(function(request,response) {
  sys.puts(request.url);
  var body = 'hello world';
  response.writeHead(200, {
  'Content-Length': body.length,
  'Content-Type': 'text/plain'
  });
  response.write(body, 'utf8')
  response.end();
});
server.addListener('close',function(errno) {
  sys.puts('close ' + errno);
});
server.listen(8001);
