const net = require("net");
const images = require("images");
const parser = require("./parser.js");
const render = require("./render");

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
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port,
          },
          () => {
            connection.write(this.toString());
          }
        );
      }
      connection.on("data", (data) => {
        parse.receive(data.toString());
        if (parse.isFinished) {
          resolve(parse.response);
          connection.end();
        }
      });

      connection.on("error", (err) => {
        reject(err);
        connection.end();
      });
    });
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers)
  .map((key) => `${key}: ${this.headers[key]}`)
  .join("\r\n")}\r
\r
${this.bodyText}`;
  }
}

class ResponseParser {
  constructor() {
    this.WAITTING_STATUS_LINE = 0;
    this.WAITTING_STATUS_LINE_END = 1;
    this.WATTING_HEADER_NAME = 2;
    this.WATTING_HEADER_SPACE = 3;
    this.WATTING_HEADER_VALUE = 4;
    this.WATTING_HEADER_LINE_END = 5;
    this.WATTING_HEADER_BLOCK_END = 6;
    this.WATTING_BODY = 7;

    this.current = this.WAITTING_STATUS_LINE;
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.bodyparser = null;
  }

  get isFinished() {
    return this.bodyparser && this.bodyparser.isFinished;
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyparser.content.join(""),
    };
  }

  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }

  receiveChar(char) {
    if (this.current === this.WAITTING_STATUS_LINE) {
      if (char === "\r") {
        this.current = this.WAITTING_STATUS_LINE_END;
      } else {
        this.statusLine += char;
      }
    } else if (this.current === this.WAITTING_STATUS_LINE_END) {
      if (char === "\n") {
        this.current = this.WATTING_HEADER_NAME;
      }
    } else if (this.current === this.WATTING_HEADER_NAME) {
      if (char === ":") {
        this.current = this.WATTING_HEADER_SPACE;
      } else if (char === "\r") {
        this.current = this.WATTING_HEADER_BLOCK_END;
        if (this.headers["Transfer-Encoding"] === "chunked") {
          this.bodyparser = new BodyParser();
        }
      } else {
        this.headerName += char;
      }
    } else if (this.current === this.WATTING_HEADER_SPACE) {
      if (char === " ") {
        this.current = this.WATTING_HEADER_VALUE;
      }
    } else if (this.current === this.WATTING_HEADER_VALUE) {
      if (char === "\r") {
        this.current = this.WATTING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = "";
        this.headerValue = "";
      } else {
        this.headerValue += char;
      }
    } else if (this.current === this.WATTING_HEADER_LINE_END) {
      if (char === "\n") {
        this.current = this.WATTING_HEADER_NAME;
      }
    } else if (this.current === this.WATTING_HEADER_BLOCK_END) {
      if (char === "\n") {
        this.current = this.WATTING_BODY;
      }
    } else if (this.current === this.WATTING_BODY) {
      this.bodyparser.receiveChar(char);
    }
  }
}

class BodyParser {
  constructor() {
    this.WATTING_LENGTH = 0;
    this.WATTING_LENGTH_LINE_END = 1;
    this.READING_CHUNK = 2;
    this.WATTING_NEW_LINE = 3;
    this.WATTING_NEW_LINE_END = 4;

    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.current = this.WATTING_LENGTH;
  }

  receiveChar(char) {
    if (this.current === this.WATTING_LENGTH) {
      if (char === "\r") {
        if (this.length === 0) {
          this.isFinished = true;
        }
        this.current = this.WATTING_LENGTH_LINE_END;
      } else {
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    } else if (this.current === this.WATTING_LENGTH_LINE_END) {
      if (char === "\n" && !this.isFinished) {
        this.current = this.READING_CHUNK;
      }
    } else if (this.current === this.READING_CHUNK) {
      this.content.push(char);
      this.length--;
      if (!this.length) {
        this.current = this.WATTING_NEW_LINE;
      }
    } else if (this.current === this.WATTING_NEW_LINE) {
      if (char === "\r") {
        this.current = this.WATTING_NEW_LINE_END;
      }
    } else if (this.current === this.WATTING_NEW_LINE_END) {
      if (char === "\n") {
        this.current = this.WATTING_LENGTH;
      }
    }
  }
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
  let dom = parser.parserHTML(resp.body);
  let viewport = images(800, 600);
  render(viewport, dom[0]);
  viewport.save("viewport.jpg");
})();
