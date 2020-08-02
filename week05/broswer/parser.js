const css = require("css");
const layout = require("./layout");
const EOF = Symbol("EOF");

let currentToken = null;
let currentAttritube = null;
let currentTextNode = "";

let stack = [{ type: "doucument", children: [] }];

let rules = [];

function match(element, selector) {
  if (!selector || !element.attribtues) {
    return false;
  }

  if (selector.charAt(0) === "#") {
    const attr = element.attribtues.filter((attr) => attr.name === "id")[0];
    if (attr && attr.value === selector.replace("#", "")) {
      return true;
    }
  } else if (selector.charAt(0) === ".") {
    const attr = element.attribtues.filter((attr) => attr.name === "class")[0];
    if (attr && attr.value === selector.replace(".", "")) {
      return true;
    }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }
  return false;
}

function specificity(selector) {
  const p = [0, 0, 0, 0];
  const selectParts = selector.split(" ");
  for (const part of selectParts) {
    if (part.charAt(0) === "#") {
      p[1] += 1;
    } else if (part.charAt(0) === ".") {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }

  return p;
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0];
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1];
  }

  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2];
  }

  return sp1[3] - sp2[3];
}

function addCssRule(text) {
  const ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
}

function computeCss(element) {
  const elements = stack.slice().reverse();
  if (!element.computeStyle) {
    element.computeStyle = {};
  }

  for (let rule of rules) {
    const selectParts = rule.selectors[0].split(" ").reverse();

    if (!match(element, selectParts[0])) {
      continue;
    }

    let matched = false;

    let j = 1;

    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectParts[j])) {
        j++;
      }
    }

    if (j >= selectParts.length) {
      matched = true;
    }

    if (matched) {
      const computeStyle = element.computeStyle;
      const sp = specificity(rule.selectors[0]);
      for (let declaration of rule.declarations) {
        if (!computeStyle[declaration.property]) {
          computeStyle[declaration.property] = {};
        }
        if (!computeStyle[declaration.property].specificity) {
          computeStyle[declaration.property].value = declaration.value;
          computeStyle[declaration.property].specificity = sp;
        } else if (
          compare(computeStyle[declaration.property].specificity, sp) <= 0
        ) {
          computeStyle[declaration.property].value = declaration.value;
          computeStyle[declaration.property].specificity = sp;
        }
      }
    }
  }
}

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

    computeCss(element);

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
      // 遇到style标签结束，进行css规则解析
      if (token.tagName === "style") {
        addCssRule(top.children[0].content);
      }
      layout(top);
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
  return stack;
};
