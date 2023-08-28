const obj = {};
Object.defineProperties(obj, {
    property: {enumerable: false, value: 2}
});

const sKey = Symbol('a')
obj[sKey] = 'a'

console.log(Reflect.ownKeys(obj))