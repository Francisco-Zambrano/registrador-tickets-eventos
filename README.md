# TERCERA ENTREGA DEL PROYECTO FINAL

# Mejorando la arquitectura del servidor

Para iniciar el servidor, ejecutar:
npm run dev

El proyecto esta estructurado por capas:

- DAO: Abstracción de operaciones de acceso a datos (CRUD).
- DTO: Objeto simple para transferir datos entre capas.
- Repository: Abstracción más amplia que puede incluir lógica de negocio y trabajar con múltiples entidades.

# Para revisar el proyecto, seguir las siguientes recomendaciones

## 1. Login del Usuario

POST: Login de un usuario.

```http
 http://localhost:8080/api/sessions/login
```

Body:
{
"email":"juana@test.com",
"password":"123"
}

## 2. Carrito del usuario

GET: Verificar la existencia del carrito asociado al usuario.

```http
 http://localhost:8080/api/carts/665e77e65acc9c9959341793
```

## 3. Compra

Post: Realizar la compra del carrito.

```http
 http://localhost:8080/api/carts/665e77e65acc9c9959341793/purchase
```

## 4. Verificar ticket (user)

Get: Ingresar como usuario para verificar el ticket. Debe mostrar el siguiente mensaje:
{
"error": "Forbidden: Access is allowed only for administrators"
}

```http
 http://localhost:8080/api/tickets
```

## 5. Logout (user)

Get: Realizar logout del usuario. Debe mostrar el siguiente mensaje:
{
"payload": "successful logout"
}

```http
 http://localhost:8080/api/sessions/logout
```

## 6. Login (admin)

Post: Realizar login con rol Admin.

```http
 http://localhost:8080/api/sessions/login
```

Body:
{
"email":"adminCoder@coder.com",
"password":"adminCod3r123"
}

## 7. Verificar ticket (admin)

Get: Ingresar como admin para verificar el ticket. Debe contener lo siguiente:

```http
 http://localhost:8080/api/tickets
```

Debe mostrar lo siguiente:

{
"id": "",
"code": "",
"purchase_datetime": "",
"amount": ,
"purchaser": ""
}

## 8. Verificar ticket mediante id(admin)

Get: Ingresar como admin para verificar el ticket. Debe contener lo siguiente:

```http
 http://localhost:8080/api/tickets/:id
```

Debe mostrar lo siguiente:

{
"id": "",
"code": "",
"purchase_datetime": "",
"amount": ,
"purchaser": ""
}
