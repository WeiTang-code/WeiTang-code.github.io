---
title: JS对象方法
date: 2023-08-28 11:40:55
tags:
---

# 对象的遍历  
对象可以采用如下方法遍历
- `Object.GetOwnPropertyNames()`
- `for(let key in obj)`
- `Object.keys()`
- `Object.values()`  

## 1. `Object.GetOwnPropertyNames`和`Object.keys`的异同：  
- 这两种方法都可以获取对象的属性（键）。  
- 两种方法都**不能**遍历`Symbol`属性。
- `keys`只能遍历可枚举属性。`GetOwnPropertyNames`可以遍历可枚举属性和不可枚举属性。

举例：
```javascript
const obj = {};
Object.defineProperties(obj, {
    property1: {enumerable: true, value: 1},
    property2: {enumerable: false, value: 2},
});

console.log(Object.keys(obj)); //> Array ["property1"]
console.log(Object.getOwnPropertyNames(obj)); //> Array ["property1", "property2"]
```

## 2. 如何判断对象为空？  
我们可能会想到利用如下方法来判断
- `JSON.stringify()`
- `Object.keys()`
- `Object.GetOwnPropertyNames()`
- `for(let key in obj)`  

这几种方法都存在缺陷，首先，除了`Object.GetOwnPropertyNames()`，其余的方法都无法获取不可枚举属性，导致判断错误。  
另外，上述四种方法都无法获取健为`Symbol`类型的属性。  
### 严谨方法  
`Reflect.ownKeys()可以获取对象中所有类型的属性`
```javascript
function isEmpty(obj) {
    return Reflect.ownKeys(obj).length === 0
}
```
举例
```javascript
const obj = {};
Object.defineProperties(obj, {
    property: {enumerable: false, value: 2}
});

const sKey = Symbol('a')
obj[sKey] = 'a'

console.log(Reflect.ownKeys(obj)) // [ 'property', Symbol(a) ]
```