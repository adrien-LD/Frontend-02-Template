学习笔记

### EventLoop
* #### 宏观任务
宿主发起的任务为宏观任务，如setTimeout、setInterval、setImmediate，I/O
* #### 微观任务
JavaScript引擎发起的任务为微观任务,如Promise

* #### 如何分析异步执行的顺序
	* 首先我们分析有多少个宏任务；
	* 在每个宏任务中，分析有多少个微任务；
	* 根据调用次序，确定宏任务中的微任务执行次序；
	* 根据宏任务的触发规则和调用次序，确定宏任务的执行次序；
确定整个顺序。

![](https://raw.githubusercontent.com/adrien-LD/Frontend-02-Template/master/week03/img/task.png)

### 预处理
  > 预处理pre-process 在代码执行之前javascript引擎会对代码做预先处理
#### var 
var不管是写在函数哪个位置，if里面 return之后， catch里面 finally里面都会预处理声明到函数级别。
```js
var a = 2;

(function () {
a = 1;
return;
var a = 1;
})();

console.log(a); // 2

var a = 2;

(function () {
a = 1;
return;
const a = 1;
})();

console.log(a);
// Cannot access 'a' before initialization
// 2
```

#### let、const、class
let、const、class也会进行预处理，不管写在那个位置都会预处理声明到函数级别，但是和var不同得是在实际声明代码之前使用该变量会抛出错误
```js
const b = 1;

function test() {
  console.log(b);
  const b = 2;
}

test(); // Cannot access 'a' before initialization

let b = 1;

function test1() {
  console.log(b);
  let b = 2;
}

test1(); // Cannot access 'b' before initialization;

class c {d = 1};
function test2() {
  console.log(c);
  class c {};
}

test2(); // Cannot access 'c' before initialization
```

### 其他
除了课程学习外还阅读了[ECMAScript标准](https://www.ecma-international.org/ecma-262/11.0/index.html)得内容，标准得内容很多，本周只是读了关于语法得部分，关于标准得其他内容会在后续补充

关于 **JavaScript 引擎里面 Realm 所有的对象** 实际上并没有想到获取方法，主要是在重学前端得课程中找到了winter对于内置对象得分类，暂时认为这个就是realm中得所有对象。