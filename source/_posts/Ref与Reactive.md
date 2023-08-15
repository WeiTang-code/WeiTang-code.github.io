---
title: Ref与Reactive
date: 2023-08-14 14:14:09
tags: Vue响应式Api
---

## 为什么有了Reactive还要提供Ref？  
`Vue`的`Reactive`和`Ref`的目的都是创建响应式数据，`Reactive`作用于引用类型，`Ref`作用于基本类型。  
`Reactive`基于`Proxy`，每次调用都会创建一个新的`Proxy`对象，而`Ref`只是对数据简单的提供了get和set，因此基本数据类型使用`Ref`的开销更小。