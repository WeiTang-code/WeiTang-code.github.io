
const id = setInterval(() => {
    console.log(1)
}, 0)

setTimeout(() => {
    clearInterval(id)
}, 0)

// interval 1  ms
// timeout 0.4 ms