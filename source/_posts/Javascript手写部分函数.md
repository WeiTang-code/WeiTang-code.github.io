---
title: Javascript手写部分函数
date: 2023-08-15 10:16:19
tags:
---

## call、apply、bind  
### call  
- 核心在于理解this表示该函数，用Symbol()防止命名冲突
```javascript
Function.prototype.myCall = function(context = window, ...args) {
    if (typeof context !== "object"){
        context = new Object(context)
    }
    // 防止命名冲突
    const fnKey = Symbol()
    // this相当于调用myCall的function
    context[fnKey] = this
    let res = context[fnKey](...args)
    delete context[fnKey]
    return res
}
```
### apply  
- 基本和call一样，注意参数接收方式不同
```javascript
Function.prototype.myApply = function(context = window, args) {
    if (typeof context !== "object"){
        context = new Object(context)
    }
    // 防止命名冲突
    const fnKey = Symbol()
    // this相当于调用myCall的function
    context[fnKey] = this
    let res = context[fnKey](...args)
    delete context[fnKey]
    return res
}
```  
### bind  
- 注意使用柯里化，不能立刻调用，这里我使用了箭头函数解决this的指向问题
```javascript
Function.prototype.myBind = function (context = window, ...args){
    if (typeof context !== 'object'){
        context = new Object(context)
    }
    return ()=>{
        let fnKey = Symbol()
        context[fnKey] = this
        let res = context[fnKey](...args)
        delete context[fnKey]
        return res
    }
}
```  
### 测试用例
```javascript
function fn(a,b){
    console.log(a+b)
    console.log(this.name)
}

const obj = {
    name:'tw'
}

// fn.myCall(obj, 1, 2)
// fn.myApply(obj,[1,2])
const tempFn = fn.myBind(obj,1,2)
tempFn()
```