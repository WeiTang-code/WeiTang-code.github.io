---
title: 手写EventBus
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
}
```

## 测试用例  
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