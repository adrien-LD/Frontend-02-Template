本周学习总结：
## 本周练习
#### 1、使用BNF书写带括号的四则运算
```
<mul>::=<number>|<mul>"*"<number>|<mul>"\"<number>|<mul>"*""("<mul>")"|<mul>"\""("<mul>")"
<add>::=<mul>|<add>"+"<mul>|<add>"-"<mul>|<add>"-""("<add>|<mul>")"|<add>"+""("<add>|<mul>")"
```

#### 2、找到所知道的编程语言并进行分类
**形式语言-用途**
- 数据描述语言 JSON 、HTML、XAML、SQL、CSS
- 编程语言： C++、C、Java、C#、Python、Ruby、Perl、Lisp、T-SQL、Clojure、Haskel、JavaScript

**形式语言-表达方式**
- 声明式语言 JSON 、HTML、XAML、SQL、CSS 、Lisp、Clojure、Haskel
- 命令型语言： C++、C、Java、C#、Python、Ruby、Perl、T-SQL、JavaScript

#### 3、编写js函数实现将字符串转为其utf8编码的形式输出
```js
function stringToUtf8(string: string): Uint8Array{
  const encoder = new TextEncoder();
  return encoder.encode(string);
}

const encoding = stringToUtf8('一');

console.log(encoding);// Uint8Array(3) [ 228, 184, 128 ]
```

#### 4、实现对于"狗咬人"行为的抽象
```js
class Dog {
  bite(human: Human): void {
    const roundDamage = Math.round(Math.random()*30); 
    console.log('咬人了');
    human.hurt(roundDamage);
  }
}

class Human {
  private hp: number; // 血量

  constructor(hp: number = 100){
    this.hp = hp;
  }

  hurt(damage: number) {
    this.setHp(this.hp - damage);
  }

  getHp(): number {
    return this.hp;
  }

  setHp(hp: number): void {
    this.hp = hp;
  }
}

const dog = new Dog();
const human =  new Human(300);
const damage = dog.bite(human);
console.log(human.getHp())
```

#### 5、查到所有具有特性行为的js内置对象

**Array**：Array 的 length 属性根据最大的下标自动发生变化。
**Object.prototype**：作为所有正常对象的默认原型，不能再给它设置原型了。
**String**：为了支持下标运算，String 的正整数属性访问会去字符串里查找。
**Arguments**：arguments 的非负整数型下标属性跟对应的变量联动。模块的 
**namespace**: 对象：特殊的地方非常多，跟一般对象完全不一样，尽量只用于 import 吧。
**类型数组和数组缓冲区**：跟内存块相关联，下标运算比较特殊。
**bind 后的 function**：跟原来的函数相关联。

## 本周学习中遇到的未知概念和模糊的点的一些资料
* BNF产生式: 对于产生式的概念为第一次接触,此文章讲解已足够：https://www.cnblogs.com/huiyenashen/p/4445676.html
* number类型双精度浮点型表示问题： 关于双精度浮点型的[定义](https://zh.wikipedia.org/wiki/IEEE_754)，参考的维基百科的解释;