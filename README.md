# PROYECTO FINAL DE BACKEND DE UN E-COMMERCE

## Configuración Inicial

1. Clona el repositorio en tu máquina local.
2. Modifica el archivo `.env` según los parámetros enviados. Este archivo debe contener las configuraciones necesarias para la ejecución del proyecto, como las credenciales de la base de datos, puertos, etc.

## Ejecución del Proyecto

Para iniciar el servidor de desarrollo, ejecuta el siguiente comando:

```
npm run dev
```

El servidor se iniciará en el puerto especificado en tu archivo .env, por defecto en http://localhost:8080.

## API Endpoints

## Products

GET: Deberá poder recibir por query params un limit, una page y un sort


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

DELETE: Deberá eliminar del carrito el producto seleccionado.

```http
 http://localhost:8080/api/carts/:cid/product/:pid
```

PUT Deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body

```http
http://localhost:8080/api/carts/:cid/product/:pid
```

Body:
{"quantity":number}

PUT: Deberá actualizar el carrito con un arreglo de productos

```http
 http://localhost:8080/api/carts/:cid/products/:pid
```

DELETE: Deberá eliminar todos los productos del carrito

```http
 http://localhost:8080/api/carts/:cid/product/:pid
```

## Sessions

POST: Registra un usuario.

```http
 http://localhost:8080/api/sessions/register
```

Body:
{
"first_name":"string ",
"last_name":"string",
"age":"number",
"email":"string",
"password":"string"
}

POST: Login de un usuario.

```http
 http://localhost:8080/api/sessions/login
```

Body:
{
"email":"string",
"password":"string"
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

GET: Password Restore
Permite al usuario generar una nueva contraseña ingresando su mail.

```http
 http://localhost:8080/api/sessions/mail
```

## Purchase

POST: Purchase
Permite comprar un carrito.

```http
 http://localhost:8080/api/carts/:cid/purchase
```

## Tickets

GET: A Ticket
Permite obtener un ticket específico.

```http
 http://localhost:8080/api/tickets/:id
```

GET: A Ticket
Permite obtener todos los tickets.

```http
 http://localhost:8080/api/tickets/
```

## Mocking

GET: Mocking
Permite obtener un mocking de productos para pruebas.

```http
 http://localhost:8080/api/mockingproducts
```

## Logger

GET: Logger Test
Permite hacer pruebas mediante Logger, Chai y supertest.

```http
 http://localhost:8080/loggerTest
```

## User

POST: User Role
Permite cambiar el rol de un usuario de "user" a "premium".

```http
 http://localhost:8080/api/users/premium/:uid
```

POST: Documents
Permite al usuario subir documentos, imagen para el perfil e imágenes para productos.

```http
 http://localhost:8080/api/users/:uid/documents
```
Deberá adjuntar archivo desde el body
| Key   | type  | value     |
| :---- | :------- | :------- |
| profile | `file` | `document` |
| document | `file` | `document` |
| product | `file` | `document` |

POST: User Role
Permite al usurio subir documentos necesario para cambiar el rol de "user" a "premium".

```http
 http://localhost:8080/api/users/:uid/documents
```
Deberá adjuntar archivo desde el body
| Key   | type  | value     |
| :---- | :------- | :------- |
| document | `file` | `comprobante de domicilio` |
| document | `file` | `comprobante de estado de cuenta` |
| document | `file` | `identificacion` |


GET: Users
Permite obtener el listado e información de los usuarios existentes.

```http
 http://localhost:8080/api/users/
```

DELETE: Users
Permite eliminar a los usuarios que no hayan tenido conexión en los últimos 2 días.

```http
 http://localhost:8080/api/users/inactive
```