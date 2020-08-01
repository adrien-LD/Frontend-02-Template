const EOF = Symbol("EOF");

let currentToken = null;
let currentAttritube = null;
let currentTextNode = "";

let stack = [{ type: "doucument", children: [] }];

function emit(token) {
  let top = stack[stack.length - 1];
  if (token.type === "startTag") {
    let element = {
      type: "element",
      children: [],
      attribtues: [],
    };

    element.tagName = token.tagName;

    for (let p in token) {
      if (p != "type" && p != "tagName") {
        element.attribtues.push({
          name: p,
          value: token[p],
        });
      }
    }

    top.children.push(element);
    element.parent = top;

    if (!token.isSelfClose) {
      stack.push(element);
    }

    currentTextNode = null;
  } else if (token.type == "endTag") {
    if (top.tagName != token.tagName) {
      throw new Error("标签配对错误");
    } else {
      stack.pop();
    }

    currentTextNode = null;
  } else if (token.type === "text") {
    if (currentTextNode === null) {
      currentTextNode = {
        type: "text",
        content: "",
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

function data(c) {
  if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: EOF,
    });
    return;
  } else {
    emit({
      type: "text",
      content: c,
    });
    return data;
  }
}

function tagOpen(c) {
  if (c === "/") {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: "",
    };
    return tagName(c);
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(c);
  } else if (c === EOF) {
  } else if (c === ">") {
  } else {
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-z0-9]$/)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c === ">") {
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === ">" || c === "/" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
    return;
  } else {
    currentAttritube = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c === "/" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === '"' || c === "'" || c === "<") {
  } else {
    currentAttritube.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
    return beforeAttributeValue;
  } else if (c === '"') {
    return doubleQuoteAttributeValue;
  } else if (c === "'") {
    return singleQuoteAttributeValue;
  } else if (c === ">") {
  } else {
    return unQutedAttributeValue(c);
  }
}

function doubleQuoteAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttritube.name] = currentAttritube.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === EOF) {
  } else {
    currentAttritube.value += c;
    return doubleQuoteAttributeValue;
  }
}

function singleQuoteAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttritube.name] = currentAttritube.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === EOF) {
  } else {
    currentAttritube.value += c;
    return singleQuoteAttributeValue;
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttritube.name] = currentAttritube.value;
    emit(currentToken);
    return data;
  } else {
    currentAttritube.vaue += c;
    return doubleQuoteAttributeValue;
  }
}

function unQutedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttritube.name] = currentAttritube.value;
    return beforeAttributeName;
  } else if (c === "/") {
    currentToken[currentAttritube.name] = currentAttritube.value;
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttritube.name] = currentAttritube.value;
    emit(currentToken);
    return data;
  } else if (c === "\u0000") {
  } else if (c === '"' || c === "'" || c === "<" || c === "=" || c === "`") {
  } else if (c === "EOF") {
  } else {
    currentAttritube.value += c;
    return unQutedAttributeValue;
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === ">") {
    currentToken[currentAttritube.name] = currentAttritube.value;
    emit(currentToken);
    return data;
  } else if (c === "EOF") {
  } else {
    currentToken[currentAttritube.name] = currentAttritube.value;
    currentAttritube = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}

function selfClosingStartTag(c) {
  if (c === ">") {
    currentToken.isSelfClose = true;
    emit(currentToken);
    return data;
  } else if (c === "EOF") {
  } else {
  }
}

module.exports.parserHTML = function parserHtml(htmlStr) {
  let state = data;
  for (let e of htmlStr) {
    state = state(e);
  }
  state(EOF);

  console.log(stack);
};
