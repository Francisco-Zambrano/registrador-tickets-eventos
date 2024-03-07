const ProductManager = require("./productManager")

const product = new ProductManager();





console.log(product.getProducts());

console.log(product.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25))

console.log(product.getProducts());

console.log(product.addProduct('producto prueba2', 'Este es un producto prueba2', 300, 'Sin imagen', 'abc123', 20))
console.log(product.addProduct('producto prueba3', 'Este es un producto prueba3', 400, 'Sin imagen', 'def456', 30))

console.log(product.getProducts());

console.log(product.getProductById(2));