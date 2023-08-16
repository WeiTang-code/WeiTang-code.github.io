---
title: JS的执行顺序
date: 2023-08-16 11:14:47
tags: [宏任务及微任务执行顺序]
---

JS的执行顺序问题其实非常简单，只需要理解清楚JS的EventLoop（事件循环机制），并捋清楚一个代码中哪些是宏任务，哪些是微任务即可。  
EventLoop：  
首先将整个JS代码作为一个宏任务
- 执行一个宏任务
- 执行微任务队列中所有的微任务

循环往复  

```javascript
console.log(1)
setTimeout(()=>{
    console.log(2)
    Promise.resolve().then(()=>{
        console.log(3)
    })
})

setTimeout(()=>{
    console.log(4)
    Promise.resolve().then(()=>{
        console.log(5)
    })
})

console.log(6)
```

上述代码的执行顺序为  
162345