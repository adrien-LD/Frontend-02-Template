学习笔记

### 4.JS结构化
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

![](C:\geek\Frontend-02-Template\week03\img\task.png)

除了课程学习外还阅读了[ECMAScript标准](https://www.ecma-international.org/ecma-262/11.0/index.html)得内容，标准得内容很多，本周只是读了关于语法得部分，关于标准得其他内容会在后续补充