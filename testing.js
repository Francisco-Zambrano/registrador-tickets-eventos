const ProductManager = require("./productManager")

const product = new ProductManager();





// console.log(product.getProducts());

console.log(product.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25))

// // console.log(product.getProducts());

// console.log(product.addProduct('producto prueba2', 'Este es un producto prueba2', 300, 'Sin imagen', 'abc567', 20))
// console.log(product.addProduct('producto prueba3', 'Este es un producto prueba3', 400, 'Sin imagen', 'def456', 30))

// console.log(product.getProducts());

// console.log(product.getProductById(2));

// console.log(product.deleteProduct(2));

const updateProductTest = {
    "id": 4,
    "title": "producto prueba 4"
}
console.log(product.updateProduct(3, updateProductTest));