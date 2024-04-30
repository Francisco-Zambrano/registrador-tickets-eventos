-----> Para iniciar el servidor, ejecutar:
npm run dev

--- PRIMERA PRÁCTICA DE INTEGRACIÓN, MONGO DB, MONGOOSE--

1. Acceder a las siguientes direcciones:
   http://localhost:8080
   http://localhost:8080/realtimeproducts

2. En "/realtimeproducts" agregar un producto en el formulario.

3. Verificar los siguientes ENDPOINTS

- RUTA: products

GET
http://localhost:8080/api/products

POST
http://localhost:8080/api/products

body:
{
"title": "Acer Predator Triton 500",
"description": "Intel i7-12700H, GeForce RTX 3060, 16 WQXGA 240Hz G-SYNC Display, 16GB DDR5",
"price": 2000,
"code": "apt500",
"stock": 20,
"thumbnail": ["http://imgexample.com"],
"category": "notebooks"
}

PUT
http://localhost:8080/api/products/663043494efa5665ec81c3dc

body
{
"thumbnail": [
"http://imgexample.com"
],
"category": "notebooks",
"stock": "40"
}

DEL
http://localhost:8080/api/products/663043494efa5665ec81c3dc

- RUTA: carts

GET
http://localhost:8080/api/carts/662e53aa94f04b2be1e81706

POST (a car)
http://localhost:8080/api/carts/

POST (a product into a cart)
http://localhost:8080/api/carts/66304ba6805b018aa33c9c46/product/6630454be54dc62311b0e184
