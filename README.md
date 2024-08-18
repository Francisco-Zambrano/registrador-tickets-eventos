# Cuarta Práctica Integradora

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

1. Iniciar Sesión
Para iniciar sesión como un usuario, realiza una petición POST a la siguiente URL:
```
URL: http://localhost:8080/api/sessions/login
Método: POST
Body (raw JSON):
json
Copy code
{
    "email": "juana@test.com", 
    "password": "123"
}
```

2. Cambiar Rol de Usuario a Premium
Para cambiar el rol de un usuario a premium, primero debes intentar realizar la petición para verificar si falta algún documento:
```
URL: http://localhost:8080/api/users/premium/uid
Método: POST
```
Parámetro URL: uid = 665e77e65acc9c9959341795 (ID de usuario para pruebas)
Si los documentos faltan, se mostrará el siguiente mensaje: 'Some documents are missing, Please check file names'.

3. Subir Documentos Requeridos
Sube los documentos necesarios para cambiar el rol del usuario a premium:

```
URL: http://localhost:8080/api/users/uid/documents
Método: POST
Body (form-data):
key: document
file: archivo local llamado "comprobante de domicilio"
key: document
file: archivo local llamado "comprobante de estado de cuenta"
key: document
file: archivo local llamado "identificación"
```
Al subir correctamente los documentos, se mostrará el mensaje: 'Documents uploaded successfully' y un array con los documentos subidos.

4. Cambiar Rol de Usuario a Premium (Nuevamente)
Después de subir los documentos, realiza nuevamente la petición para cambiar el rol del usuario:
```
URL: http://localhost:8080/api/users/premium/uid
Método: POST
```
Parámetro URL: uid = 665e77e65acc9c9959341795 (ID de usuario para pruebas)
Si todo es correcto, se mostrará el mensaje: 'User role updated to premium' y se listarán los documentos subidos.
Al hacer la petición nuvemante, deberá mostrar el mensaje: 'The user already has the premium role'

5. Subir Documentos a Carpetas Específicas
Para subir documentos específicos a las carpetas documents, products, y profiles:
```
URL: http://localhost:8080/api/users/uid/documents
Método: POST
Body (form-data):
key: profile
file: archivo local (perfil)
key: document
file: archivo local (documento)
key: product
file: archivo local (producto)
```