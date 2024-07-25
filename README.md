# TERCERA PRÁCTICA INTEGRADORA

# Sistema de recuperación de contraseña

Para iniciar el servidor, ejecutar:
npm run dev

Para revisar el proyecto, seguir las siguientes recomendaciones

## 1. Registro de un usuario

POST: Login de un usuario.

```http
http://localhost:8080/register
```

## 2. Login del Usuario

POST: Ingresar a login y hacer click en "Forgot your password? Click Here".

```http
http://localhost:8080/login
```

## 3. Restablecer contraseña

Post: ingresar el mail de usuario registrado

```http
 http://localhost:8080/mail
```

## 4. Revisar la casilla del mail y hacer click en el botón "Reset Password"
## 5. se abrirá una nueva venta en el cual deberá ingresar la nueva contraseña
## 6. Luego se redirige al usuario al Login. Deberá ingresar su mail y su nueva contraseña

```http
 http://localhost:8080/login
```

## 4. Establecer un nuevo rol del user.

POST: al ingresar a la siguiente dirección, podrá cambiar el role del usuario de "user" a "premium" y viceversa.

```http
 http://localhost:8080/api/sessions/register
```