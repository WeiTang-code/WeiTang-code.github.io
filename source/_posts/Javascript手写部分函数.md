---
title: Javascript手写部分函数
date: 2023-08-15 10:16:19
tags:
---

## 1. call、apply、bind  
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

## 2. instanceof  
- 要注意__proto__和prototype的区别
```javascript
function myInstanceOf (instance, target) {
    if (typeof instance !== 'object' || instance==null) return false
    let proto = instance.__proto__
    while (proto) {
        if (proto === target.prototype) {
            return true
        }
        proto = proto.__proto__
    }
    return false
}
```

### 测试用例  
```javascript
console.log(myInstanceOf({}, Array));
console.log(myInstanceOf([], Array));
console.log(myInstanceOf({}, Object));
console.log(myInstanceOf(function (){}, Function));
```

## new  
```javascript
function myNew(constuctor, ...args) {
    let newObj = Object.create(constuctor.prototype)
    
    let res = constuctor.apply(newObj, args)
    return typeof res === 'object' ? res : newObj
}
```

### 测试用例
```javascript
Person.prototype.say = function() {
    console.log(this.age);
};
let p1 = myNew(Person, "poety", 18);
console.log(p1.name);
console.log(p1);
p1.say();
```