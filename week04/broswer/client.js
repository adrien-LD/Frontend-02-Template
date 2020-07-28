const net = require("net");

class Request {
  constructor({
    method = "GET",
    host,
    port = 80,
    path = "/",
    body = {},
    headers = {},
  }) {
    this.method = method || "GET";
    this.host = host;
    this.port = port;
    this.path = path || "/";
    this.body = body || {};
    this.headers = headers || {};
    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(body);
    } else if (
      this.headers["Content-Type"] === "application/x-www-form-urlencoded"
    ) {
      this.bodyText = Object.keys(body)
        .map((key) => `${key}=${encodeURIComponent(body[key])}`)
        .join("&");
    }
    this.headers["Content-Length"] = this.bodyText.length;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      console.log("开始发送请求了");
      const parse = new ResponseParser();
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port,
        }, () => {
            connection.write(this.toString());
        });
      }
      connection.on('data', (data) => {
        console.log(data.toString());
        parse.receive(data.toString());
        if(parse.isFinished) {
          resolve(parse.response);
          connection.end();
        }
      });

      connection.on('error', (err) => {
        reject(err);
        connection.end();
      });
    });
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
  }
}

class ResponseParser {
  constructor() {}

  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }

  receiveChar(char) {}
}

void (async function () {
  const request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: 8888,
    path: "/",
    body: {
      name: "winter",
    },
  });

  const resp = await request.send();
  console.log(resp);
})();
