function fn(){
    var i = 0
    while (i<3) {
        try {
            i++
            break
        }
        finally {
            console.log(i)
        }
    }
}

fn()