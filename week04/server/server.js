const http = require('http');

http.createServer((req, res) => {
  let body = [];
  req.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    console.log('body:', body);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('hello\n');
  })
}).listen(8888);

console.log('server started http://localhost:8888');