---
title: JS手写设计模式
date: 2023-08-15 14:55:05
tags:
---
## 实现EventBus
```javascript
class EventBus {
    constructor() {
        this.Events = {}
    }

    // 监听事件
    on(eventName, callback){
        if (!this.Events[eventName]) {
            this.Events[eventName] = new Set()
        }
        this.Events[eventName].add(callback)
    }

    // 触发事件
    emit(eventName, ...args) {
        const callbacks = this.Events[eventName]
        if (callbacks) {
            callbacks.forEach(cb => cb.apply(this, args))
        }
    }

    // 移除监听
    off(eventName, callback) {
        const callbacks = this.Events[eventName]
        if (callbacks) {
            callbacks.delete(callback)
        }
    }

    // once 只执行一次
    once(eventName, callback) {
        const func = (...args) => {
            this.off(eventName, func)
            callback.apply(this, args)
        }

        this.on(eventName, func)
    }
}
```
测试用例  
```javascript
// 使用示例
const bus = new EventBus()

// 组件A监听事件
bus.on('foo', (name) => {
  console.log('A 接收到:', name) 
})

// 组件B触发事件
bus.emit('foo', 'bar')

// 组件C监听同一个事件
bus.on('foo', (name) => {
  console.log('C 接收到:', name)
}) 

// 此时组件A和C都能接收到事件
bus.emit('foo', 'bar')
```
## 观察者模式
```javascript
class Observer {
    constructor(name) {
        this.name = name
    }

    update(ob){
        console.log(`观察者${this.name} 收到被观察者${ob.name}的通知`)
    }
}

class Observed {
    constructor(name) {
        this.name = name
        this.observers = []
    }

    // 添加观察者
    addObserver(observer) {
        this.observers.push(observer)
    }

    // 删除观察者
    removeObserver(observer) {
        this.observers.splice(this.observers.indexOf(observer), 1)
    }

    // 通知所有观察者
    notify() {
        this.observers.forEach(observer => {
            observer.update(this)
        })
    }
}
```
测试用例
```javascript
const observed = new Observed('hello')
const observer0 = new Observer('tw')
const observer1 = new Observer('ww')
observed.addObserver(observer0)
observed.addObserver(observer1)
observed.notify()
observed.removeObserver(observer0)
observed.notify()
```