const http = require("http");

http
  .createServer((req, res) => {
    let body = [];
    req
      .on("error", (err) => {
        console.error(err);
      })
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();
        console.log("body:", body);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          `<html>
          <head>
          <meta charset='utf8' />
          </head>
          <body>
          <h1 data-test='whoami'>
          what do you want form me
          </h1>
          </body>
          </html>`
        );
      });
  })
  .listen(8888);

console.log("server started http://localhost:8888");
