
function buyProduct (pid) {
    console.log(`product id: ${pid}`)

    // const idCart = '66304d5f805b018aa33c9c57'

    let cart = {
        _id : req.session.user.cart._id
    }




    fetch(`/api/carts/${cart}/products/${pid}`, {
        method: 'POST',
        headers:{ 'Content-Type': 'application/json'},
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
    })
    .catch(error => {
        console.log('Error', error)
    }) 

};