---
title: JS设计模式
date: 2023-09-08 15:24:28
tags: [设计模式]
---

# 设计模式的原则
- S - 单一职责原则 - Single Responsibility Principle  
  - 一个程序做好一件事
  - 功能太负责就拆分，每个部分保持独立
- O - 开放/封闭原则
  - 对扩展开放，对修改封闭
- 高内聚、低耦合

# 设计模式的分类
## 单例模式  
一个类只有一个实例，并提供一个访问它的全局站点
```javascript
class Danli {
    constructor() {
        this.state = 'true'
    }

    do() {
        console.log('do something')
    }
}

Danli.getInstance = (function () {
    let instance
    return function () {
        if(!instance) {
            instance = new Danli()
        }
        return instance
    }
})()

const obj1 = Danli.getInstance()
const obj2 = Danli.getInstance()
console.log(obj1 === obj2)
```
优点：
1. 提供了对唯一实例的受控访问
2. 节约内存空间，无需频繁创建和销毁对象
3. 允许可变数目的实例

缺点：
1. 单例类不利于扩展
2. 可能导致模块间的强耦合，从而不利于单元测试