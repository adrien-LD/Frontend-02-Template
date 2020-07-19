学习笔记

<div style="text-align: center; font-size: 70px;">JS语言通识</div>

# 产生式
用来描述语言语法规则的表达公式

## FNC
巴斯克-诺尔范式
语法：
- 终结符：引号和中间的字符，如运算符号等
- 非终结符：复合结构，用来表示一个复杂概念、表达式
- 可以有括号
- \* 表示重复多次
- | 表示或
- ::= 表示定义，即左侧的由右侧定义，由右侧组成

## 乔姆斯基谱系
- 0型：无限制文法

  ?::=?
  
- 1型：上下文相关文法
  
  ?<A>?::=?<B>?
  
  例如：a.get和a.get('a')

- 2型：上下文无关文法

  <A>::=?
  
- 3型：正则文法
  
  所有语言都可以用正则表示
  
  例如：if (xxx) {}


### JS算正则文法么？
总体结构都是上下文无关文法，不算严格的正则语法

### 其他产生式
EBNF、ABNF等扩展写法，一般每种语言自己会定义一种


# 现在语言分类
分类方法：自定维度
- 根据文法
  - 形式化定义
  - python除了上一行行首这种定义以外，属于严格的上下文无关文法

- 根据用途
  - 描述数据：数据描述语言
  - 用来描述过程：编程语言

- 表达：
  - 声明式，函数式，不关注过程，只关注结果
  - 命令式语言


## 图灵完备性
可以表达所有的可计算问题的语言，就具备图灵完备性
- 命令式——图灵机
  - goto
  - if和while
- 声明式——lambda
  - 递归

## 动态与静态语言
- 动态：
  - 在用户设备上
  - 在产品实际的应用运行时
  - Runtime
- 静态：
  - 在程序员设备上运行
  - 产品开发时
  - Compiletime

## 类型系统
- 动态类型系统、静态类型系统
- 强类型、弱类型

  类型转换发生的形式
    - 强类型：类型转换不会默认发生
    - 弱类型：计算式自动转换类型
- 符合类型
  - 结构体
  - 函数签名
    - 参数类型
    - 返回值类型

- 子类型
- 泛型
  - 逆变、协变
  例：Array，凡是父类型能用的方法，child类型的都能用


# 一般命令式语言
- 原子
  - 参数
  - 语法
- 表达式
  - 原子
  - 运算符
  - 产生器
- 状态
  - 表达式
  - 关键字
  - 产生器
- 结构化
  - 函数
  - 类
  - 进程
  - 命名空间
  - ...
- 程序
  - 程序
  - 模块
  - 包
  - 库

# 语法 =语义=> 运行时：编程过程


<div style="text-align: center; font-size: 70px;">JS类型</div>

# Number
## Float
双精度浮点
- 1 + 11 + 52 bit
- Sign + 表达式 + 有效位数

## 语法
- 0、0.、.2、1e3
- 0b11
- 0o10
- 0xFF

```
0.toString()  => 语法错误
0 .toString() => 正确
```

# String语法
"abc"、'abc'、\`abc\`

![UTF-8编码的结构](https://github.com/kuroikenshi/Frontend-02-Template/blob/master/week02/imgs/utf8.png)


# Object
原型prototype，继承使用[[Prototype]]原型链

为key: value结构

## key
由Symbol和String组成
- String可以直接调用访问
- Symbol内存中创建后，只能够通过变量去访问
- 没有两个一模一样的Symbol
- 可以用Symbol的特性来做权限

## Property
分为Data, Accessor(访问器)
### Data Property
[[value]]，7中基本类型

- writable是否可写

```
点运算方法不可改
可以通过define property去修改writable
```

- enumerable    是否可枚举
- configurable  是否可改变

```
 如果设置为false那么： 
  writable, enumerable, value
  都不可改变
```

### Accessor Property
- get、set 属性，为点运算使用到的方法
- enumerable 是否可枚举，影响Object.keys()、for in、forEach语法行为
- configurable
- API/Grammar
  - {}、[]、Object.defineProperty
  - Object.create、Object.setPropertyOf、Object.getPropertyOf
  - new、class、extends
  - (ES3只能用，不推荐) new、function、property

# Function
特殊对象，typeof function => 'function'可以理解为另一个基本类型
[[call]]内置行为，使用双方括号，javascript代码中，无论通过任何方式都无法访问到内置对象

# 内置对象
在外部语言实现时确实存在，但是无法通过任何javascript方式访问到的对象

如：
- Array : [[length]]
- Object.prototype : [[setPrototype]]
