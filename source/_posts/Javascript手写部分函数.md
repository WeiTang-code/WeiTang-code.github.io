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

测试用例
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

## instanceof  
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

测试用例  
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

测试用例
```javascript
Person.prototype.say = function() {
    console.log(this.age);
};
let p1 = myNew(Person, "poety", 18);
console.log(p1.name);
console.log(p1);
p1.say();
```

## 浅拷贝与深拷贝  
### 浅拷贝  
```javascript
function shallowCopy(src) {
    let dst = {}
    for (let prop in src) {
        dst[prop] = src[prop]
    }
    return dst
}
```

### 深拷贝  
- 通过JSON实现，这种方式性能较差，且只能拷贝普通对象，不能拷贝方法
```javascript
function deepCopyJson(obj) {
    return JSON.parse(JSON.stringify(obj))
}
```
- 通过递归遍历
```javascript
function checkType(any) {
    return Object.prototype.toString.call(any).slice(8, -1)
}
function clone(any){
    if(checkType(any) === 'Object') { // 拷贝对象
        let o = {};
        for(let key in any) {
            o[key] = clone(any[key])
        }
        return o;
    } else if(checkType(any) === 'Array') { // 拷贝数组
        var arr = []
        for(let i = 0,leng = any.length;i<leng;i++) {
            arr[i] = clone(any[i])
        }
        return arr;
    } else if(checkType(any) === 'Function') { // 拷贝函数
        return new Function('return '+any.toString()).call(this)
    } else if(checkType(any) === 'Date') { // 拷贝日期
        return new Date(any.valueOf())
    } else if(checkType(any) === 'RegExp') { // 拷贝正则
        return new RegExp(any)
    } else if(checkType(any) === 'Map') { // 拷贝Map 集合
        let m = new Map()
        any.forEach((v,k)=>{
            m.set(k, clone(v))
        })
        return m
    } else if(checkType(any) === 'Set') { // 拷贝Set 集合
        let s = new Set()
        for(let val of any.values()) {
            s.add(clone(val))
        }
        return s
    }
    return any;
}
```

## 柯里化  
### 法一：利用函数的length属性
要注意function的length属性可以获取该函数还有多少参数待传  
(给了初始值的参数不算数)
```javascript
function curring(fn) {
    const len = fn.length
    const allArgs = []
    return function temp(...args) {
        allArgs.push(...args)
        if (allArgs.length < len) {
            return temp
        } else {
            const ans = fn.apply(null, allArgs.slice(0, len))
            allArgs.splice(0, len)
            return ans
        }
    }
}
```
用例
```javascript
function add(a, b, c) {
    return a + b + c
}

const cAdd = curring(add)
console.log(cAdd(1, 2, 3));
console.log(cAdd(1)(2)(4))
console.log(cAdd(1))
console.log(cAdd(1, 2))
```
### 法二：利用toString隐式转换
这里`slice.call()`作复习用，实际上完全可以用`...args`
```javascript
function add() {
    // 将传入的参数转换为数组
    let args = Array.prototype.slice.call(arguments);
    
    // 定义一个函数，接收剩余的参数
    const fn = function() {
        return add.apply(null, args.concat(
            Array.prototype.slice.call(arguments)
        ));
    }

    // 转换函数的toString方法，返回计算结果
    fn.toString = function() {
        return args.reduce((a, b) => (a + b));
    }
    
    return fn;
}
```
用例
```javascript
console.log(add(1)(2)(3) == 6);
```

## 手写Promise  
### Promise实现状态变化  
有几个可以注意的点
- 使用常量让状态更加清晰
- 使用私有函数保证只有内部调用
- 将`changeState`抽离为共有函数
- try-catch捕获异常
- `bind`绑定this，这点非常重要，否则this会指向undefined
- 状态更改后就不能再更改状态
```javascript
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
    /**
     * 创建一个Promise
     * @param {Function} executor 任务执行器，立即执行
     */
    constructor(executor) {
        this._state = PENDING
        this._value = undefined
        try {
            executor(this._resolve.bind(this), this._reject.bind(this))
        } catch (e) {
            this._reject(e)
        }
    }

    _changeState(newState, value) {
        if(this._state !== PENDING){
            return
        }
        this._state = newState
        this._value = value
    }

    /**
     * 标记当前任务完成
     * @private {Function} _resolve
     * @param {any} data 任务完成时的相关数据
     */
    _resolve(data){
        this._changeState(FULFILLED, data)
    }

    _reject(reason){
        this._changeState(REJECTED, reason)
    }
}
```
测试用例  
```javascript
const pro = new MyPromise((_resolve, _reject)=>{
    _resolve('123')
    _reject('345')
    // throw new Error(123)
})

console.log(pro)
```
### 实现then函数  
要点
- 实现一个微任务队列函数
- 有一个存放函数的队列，注意队列里面存什么东西
```javascript
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

/**
 *
 * @param {Function} callback
 */
function runMicroTask(callback) {
    // // 使用setTimeOut可以模拟，但并不是微队列
    // setTimeout(callback, 0)
    // 判断node环境
    if (process && process.nextTick) {
        process.nextTick(callback)
    } else if (MutationObserver) {
        const p = document.createElement('p')
        const observer = new MutationObserver(callback)
        observer.observe(p, {
            childList: true,
        })
        p.innerText = '1'
    } else {
        setTimeout(callback, 0)
    }
}

function isPromise(obj) {
    return !!(obj && typeof obj === 'object' && typeof obj.then === 'function')
}


class MyPromise {
    constructor(executor) {
        this._state = PENDING
        this._value = undefined
        this._handles = [] // 处理函数形成的队列
        try {
            executor(this._resolve.bind(this), this._reject.bind(this))
        } catch (e) {
            this._changeState(REJECTED, e)
        }
    }

    /**
     *
     * @param {Function} executor 添加的函数
     * @param {String} state 函数什么状态下运行
     * @param {Function} resolve 让then函数返回的Promise成功
     * @param {Function} reject 让then函数返回的Promise失败
     * @private
     */
    _pushHandles(executor, state, resolve, reject) {
        this._handles.push({
            executor,
            state,
            resolve,
            reject
        })
    }

    _runOneHandle({executor, state, resolve, reject}) {
        runMicroTask(() => {
            if (this._state !== state) {
                return
            }
            if (typeof executor !== "function") {
                this._state === FULFILLED ? resolve(this._value) : reject(this._value)
            }

            try {
                const result = executor(this._value)
                if (isPromise(result)) {
                    result.then(resolve, reject)
                } else {
                    resolve(result)
                }
            } catch (e) {
                reject(e)
            }

        })
    }

    /**
     * 根据实际情况执行队列
     *
     */
    _runHandles() {
        if (this._state === PENDING) return
        while (this._handles[0]) {
            this._runOneHandle(this._handles[0])
            this._handles.shift()
        }
    }

    /**
     *
     * @param {Function} onFulfilled
     * @param {Function} onRejected
     */
    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            this._pushHandles(onFulfilled, FULFILLED, resolve, reject)
            this._pushHandles(onRejected, REJECTED, resolve, reject)
            this._runHandles() // 执行队列
        })
    }

    _changeState(state, value) {
        if (this._state !== PENDING) {
            return
        }
        this._state = state
        this._value = value
        this._runHandles() // 状态变化，执行队列
    }

    _resolve(data) {
        this._changeState(FULFILLED, data)
    }

    _reject(reason) {
        this._changeState(REJECTED, reason)
    }
}
```
测试用例  
如果手写的Promise通过了A+规范，则可以和原生Promise相互调用
```javascript
const pro1 = new MyPromise((resolve, reject) => {
    resolve(1)
})

pro1
    .then((res) => {
        console.log(res)
        return new Promise(resolve => {
            resolve(2)
        })
    })
    .then(res=>{
        console.log(res)
    })
```
### catch  
其实就是传一个rejected状态的回调
```javascript
Promise.prototype.myCatch = function (onRejected) {
    return this.then(null, onRejected)
}
```
### finally  
注意传参的方式
```javascript
/**
 *
 * @param {Function} onSettled
 */
Promise.prototype.myFinally = function (onSettled){
    return this.then((data) => {
        onSettled()
        return data
    }, reason => {
        onSettled()
        throw reason
    })
}
```
### resolve  
分情况讨论
- Promise对象
- 类Promise
- 其他值
```javascript
Promise.myResolve = function (res){
    if (res instanceof Promise) {
        return res
    }
    return new Promise((resolve, reject) => {
        if(res && typeof res === 'object' && typeof res.then === 'function'){
            res.then(resolve, reject)
        } else {
            resolve(res)
        }
    })
}
```
### reject  
```javascript
Promise.myReject = function (reason){
    return new Promise((resolve, reject)=>{
        reject(reason)
    })
}
```
### Promise.all  
注意事项
- 用一个i来记录临时的count，防止闭包和异步导致赋值顺序错误
- 注意reject只会调用一次，因此直接在循环中使用reject不会出错
- 注意用try catch防止传入null这样的参数
- 传入的为空数组时，直接resolve空数组
```javascript
/**
 * 得到一个新的Promise
 * 该Promise的状态取决于迭代器的执行
 * 全部的Promise成功，则返回的Promise成功，数据为所有Promise成功的数据，并且顺序是按照传入的顺序排序
 * 只要有一个Promise失败，则返回Promise失败，原因是第一个是啊比Promise的原因
 * @param {iterator} iterator
 */
Promise.myAll = function (iterator) {
    return new Promise((resolve, reject) => {
        try {
            const result = []
            let count = 0
            let fulfilledCount = 0
            for (const pro of iterator) {
                let i = count
                count++
                Promise.resolve(pro).then((res) => {
                    result[i] = res
                    fulfilledCount++
                    if (fulfilledCount === count) {
                        // 当前是最后一个Promise完成了
                        resolve(result)
                    }
                }, reject)
            }
            if (count === 0) {
                resolve(result)
            }
        } catch (e) {
            reject(e)
        }
    })
}
```
测试用例
```javascript
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, 'foo');
    // reject('fail')
});
const promise4 = 6

Promise.myAll([promise1, promise2, promise3, promise4]).then((values) => {
    console.log(values);
}).catch((e) => {
    console.log('失败',e)
})
```
### Promise.allSettled( )
有如下两种方式
```javascript
/**
 * 等待所有的Promise有结果之后
 * 该方法返回的Promise完成
 * 并且按照顺序将所有结果汇总
 */
Promise.myAllSettled = function (iterator) {
    return new Promise((resolve, reject) => {
        const ps = []
        let count = 0
        let doneCount = 0
        for (const p of iterator) {
            let i = count
            count++
            Promise.resolve(p).then((res) => ({
                status: 'fulfilled',
                value: res
            }), err => ({
                status: 'rejected',
                value: err
            })).then(res => {
                ps[i] = res
                doneCount++
                if (doneCount === count) {
                    resolve(ps)
                }
            })
        }
    })
}
```
可以利用all，实现更加简洁
```javascript
Promise.myAllSettled2 = function (iterator) {
    const ps = []
    for (const p of iterator) {
        ps.push(Promise.resolve(p).then(res => ({
            status: 'fulfilled',
            value: res
        }), err => ({
            status: 'rejected',
            value: err
        })))
    }
    return Promise.all(ps)
}
```
测试用例
````javascript
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
    // setTimeout(resolve, 1000, 'foo');
    reject('fail')
});
const promise4 = 6


Promise.myAllSettled2([promise1, promise2, promise3, promise4]).then((res) => {
    console.log(res)
})
````
### Promise.race( )  
注意外层的Promise只认第一次完成时的状态
```javascript
Promise.myRace = function (iterator) {
    return new Promise((resolve, reject) => {
        for (const pro of iterator) {
            Promise.resolve(pro).then(resolve, reject)
        }
    })
}
```
用例
```javascript
const pro1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1)
    }, 1000)
})

const pro2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject(2)
    }, 500)
})

Promise
    .myRace([pro1, pro2])
    .then((res) => {
        console.log(res)
    },err=>{
        console.log(err,'失败')
    })
```