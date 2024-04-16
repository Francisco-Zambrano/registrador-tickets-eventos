-----> Para iniciar el servidor, ejecutar:
npm run dev

--- Desafío Handlebars y Websockets--

1. Acceder a las siguientes direcciones:
   http://localhost:8080
   http://localhost:8080/realtimeproducts

2. En "/realtimeproducts" agregar un producto en el formulario.

--- Primera Entrega del Proyecto---

- Ruta: products

GET
http://localhost:8080/api/products

POST
http://localhost:8080/api/products

PUT
http://localhost:8080/api/products/7

DEL
http://localhost:8080/api/products/7

- Ruta: carts

GET
http://localhost:8080/api/carts/2

POST (a car)
http://localhost:8080/api/carts/

POST (a product into a cart)
http://localhost:8080/api/carts/3/product/10
