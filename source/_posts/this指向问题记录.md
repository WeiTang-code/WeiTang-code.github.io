---
title: this指向问题记录
date: 2023-08-18 10:11:28
tags:
---

## 1. 立即执行函数  
```javascript
const obj = {
    name: 'aaa',
    fn: function () {
        this.name = 'bbb';
        (function () {
            console.log(this)
        })()
    }
}

obj.fn()
```

看到这段代码，可能会误以为里面的function继承了obj内部的this，输出`bbb`，但实际上立即执行函数有一套特殊的规则。  
`立即执行函数会创建一个新的函数作用域，而在这个作用域中，this 指向了全局对象（浏览器中通常是window，严格模式下是undefined）`