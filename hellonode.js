const http = require('http');

var currentTemp = '0.0';

const server = http.createServer(function(request, response) {
  console.dir(request.param)

  if (request.method == 'POST') {
    console.log('POST')
    var body = ''
    request.on('data', function(data) {
        currentTemp = data
        console.log('New temperature received: ' + currentTemp)
    })
    request.on('end', function() {
      response.writeHead(200, {'Content-Type': 'text/html'})
      response.end('New temperature of ' + currentTemp + ' received')
    })
  } else {
    console.log('GET')
    var html = 'Current temperature of ' + currentTemp;
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.end(html);    
  }
})

const port = 3000
const host = '192.168.0.114'
server.listen(port, host)
console.log(`Listening at http://${host}:${port}`)