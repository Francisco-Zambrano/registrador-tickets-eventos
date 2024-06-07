# SEGUNDA PRACTICA INTEGRADORA

Para iniciar el servidor, ejecutar:
npm run dev

## Vistas

Products List

```http
 http://localhost:8080/
```

Real Time Products

```http
 http://localhost:8080/realtimeproducts
```

Chat

```http
 http://localhost:8080/chat
```

Products

```http
 http://localhost:8080/products
```

Cart List

```http
 http://localhost:8080/carts/66304d5f805b018aa33c9c57
```

## Products (JSON)

GET: Deberá poder recibir por query params un limit, una page y un sort

#### Get all items

```http
 http://localhost:8080/api/products?limit=4&page=1&sort=asc
```

| Key   | limit    | page     | sort         |
| :---- | :------- | :------- | :----------- |
| Value | `number` | `number` | `asc / desc` |

- limit permitirá devolver sólo el número de elementos solicitados al momento de la petición, en caso de no recibir limit, éste será de 10.
- page permitirá devolver la página que queremos buscar.
- sort: asc/desc, para realizar ordenamiento ascendente o descendente por precio, en caso de no recibir sort, no realizar ningún ordenamiento.
- El método GET deberá devolver un objeto con el siguiente formato:
  {totalPages: Total de páginas
  prevPage: Página anterior
  nextPage: Página siguiente
  page: Página actual
  hasPrevPage: Indicador para saber si la página previa existe
  hasNextPage: Indicador para saber si la página siguiente existe.
  prevLink: Link directo a la página previa (null si hasPrevPage=false)
  nextLink: Link directo a la página siguiente (null si hasNextPage=false)
  }

## Carts

DELETE: api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.

```http
 http://localhost:8080/api/carts/66304d5f805b018aa33c9c57/products/663c3a2b6202b875db072bce
```

PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body

```http
http://localhost:8080/api/carts/663cd9f7c88c61d682b9c656/products/6637ccb7a3215dd365c6e80f
```

Body:
{"quantity":3}

PUT: api/carts/:cid deberá actualizar el carrito con un arreglo de productos

```http
 http://localhost:8080/api/carts/66304d5f805b018aa33c9c57/products/663c3a2b6202b875db072bce
```

DELETE: api/carts/:cid deberá eliminar todos los productos del carrito

```http
 http://localhost:8080/api/carts/663cd9f7c88c61d682b9c656/product/6637ceee39fa9e7a01cf380a
```

## User

POST: Registra un usuario.

```http
 http://localhost:8080/api/sessions/register
```

Body:
{
"first_name":" ",
"last_name":" ",
"age":" ",
"email":" ",
"password":" "
}

POST: Login de un usuario. En preview debe dirigir a http://localhost:8080/products

```http
 http://localhost:8080/api/sessions/login
```

Body:
{
"email":" ",
"password":" "
}

GET: Perfil del usuario logueado

```http
 http://localhost:8080/profile
```

GET: logout

```http
 http://localhost:8080/api/sessions/logout
```

GET: Current
Extrae la cookie que contiene el token para obtener al usuario asociado

```http
 http://localhost:8080/api/sessions/current
```
