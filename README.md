# Evaluacion de Algoritmos y Consumo de APIs en JavaScript

Guia tecnica y documentacion de aprendizaje del proyecto de algoritmos en JavaScript y consumo asincrono de APIs REST mediante Node.js y la API publica JSONPlaceholder.

---

## 1. Introduccion y Objetivos de Aprendizaje

El proposito de este proyecto es implementar soluciones algoritmicas a problemas cotidianos de integracion de datos en JavaScript moderno, aplicando:
- Consumo asincrono de APIs mediante `fetch` nativo de Node.js.
- Control de asincronia con `async/await` y concurrencia optimizada con `Promise.all`.
- Gestion rigurosa de errores mediante bloques `try-catch` y validacion del estado de respuesta HTTP.
- Modularizacion del codigo por casos de uso bajo el patron Archivo Barril (Barrel File).
- Entrada y salida no bloqueante por consola utilizando `node:readline/promises`.
- Principio DRY (Don't Repeat Yourself) para evitar duplicidad de logica.

---

## 2. Conceptos Fundamentales de JavaScript Aplicados

### A. Asincronia y el Bucle de Eventos (Event Loop)
JavaScript es un lenguaje de ejecucion de hilo unico (single-threaded), lo que significa que procesa una sola instruccion a la vez en su pila de llamadas (Call Stack).

Para realizar operaciones lentas (como peticiones de red o lectura de teclado) sin congelar la aplicacion, Node.js delega esas operaciones al sistema operativo a traves de su capa de entrada/salida (libuv). Cuando la peticion de red finaliza, su respuesta se envia a la cola de microtareas (Microtask Queue) y el Bucle de Eventos (Event Loop) la coloca en el Call Stack en el momento en que este queda libre.

### B. Promesas y `async / await`
Una Promesa representa un valor que estara disponible en el futuro. Puede estar en tres estados:
- Pendiente (Pending): la operacion sigue en proceso.
- Cumplida (Fulfilled): la operacion concluyo con exito.
- Rechazada (Rejected): ocurrio un error.

La sintaxis `async/await` permite escribir codigo asincrono de forma secuencial y legible, eliminando la necesidad de encadenar multiples `.then()` o anidar funciones de retorno (callback hell).

### C. Concurrencia con `Promise.all` vs Cascada Secuencial
Cuando varias consultas no dependen entre si, ejecutarlas con `await` consecutivos una detras de otra suma los tiempos de red (efecto cascada o waterfall). Con `Promise.all`, todas las peticiones se envian en paralelo al servidor, reduciendo el tiempo de espera al tiempo de la peticion mas lenta.

Ejemplo conceptual:
- Secuencial: Peticion A (500ms) + Peticion B (500ms) = 1000ms.
- Paralelo (`Promise.all`): Maximo(500ms, 500ms) = ~500ms.

### D. Patron Archivo Barril (Barrel File)
Consiste en crear un archivo centralizador (en este caso `modules/index.js`) que agrupa y re-exporta todos los modulos del sistema. Gracias a esto, el archivo principal (`app.js`) solo necesita una unica linea de importacion, manteniendo el acoplamiento al minimo.

### E. Principio DRY (Don't Repeat Yourself)
Toda logica repetitiva se centraliza en un unico modulo:
- `config/apiConfig.js`: Centraliza las URLs base y endpoints.
- `utils/httpClient.js`: Centraliza la peticion `fetch`, verificacion de `response.ok`, parseo a JSON y captura de excepciones.
- `utils/consoleHelper.js`: Centraliza la entrada asincrona por teclado y el formateo de mensajes.

---

## 3. Explicacion Detallada de Cada Ejercicio

### Ejercicio 1: Listar Tareas Pendientes por Cada Usuario
- Archivo: `modules/pendingTasksModule.js`
- Que hace:
  1. Consulta en paralelo los usuarios (`/users`) y todas las tareas (`/todos`) mediante `Promise.all`.
  2. Filtra la coleccion completa de tareas conservando unicamente aquellas donde `completed === false`.
  3. Itera sobre cada usuario y le asocia sus tareas pendientes correspondientes mediante `filter` sobre el identificador de usuario (`todo.userId === user.id`).
  4. Muestra en pantalla el identificador, nombre, username, correo y conteo total de tareas pendientes de cada usuario, seguido de la lista de pendientes.

### Ejercicio 2: Busqueda de Usuario y Albumes con Fotos
- Archivo: `modules/userAlbumsModule.js`
- Que hace:
  1. Solicita al usuario por teclado el nombre de usuario (`username`) mediante `solicitarTexto`.
  2. Normaliza la entrada quitando espacios y pasando a minusculas (`trim().toLowerCase()`).
  3. Consulta la lista de usuarios y localiza la coincidencia con `.find()`.
  4. Si existe, consulta los albumes de dicho usuario (`/albums?userId=...`).
  5. Para cada album, consulta concurrentemente sus fotografias (`/photos?albumId=...`) usando `Promise.all` y `map`.
  6. Integra toda la informacion en un unico objeto y lo muestra de forma ordenada en la consola con sus datos generales, albumes y fotos asociadas sin enlaces de URL.

### Ejercicio 3: Filtrar Publicaciones por Nombre y Agregar Comentarios
- Archivo: `modules/filterPostsModule.js`
- Que hace:
  1. Solicita por teclado un termino de busqueda o nombre para filtrar los posts.
  2. Consulta la coleccion de posts (`/posts`) y filtra aquellos cuyo titulo (`post.title`) incluya el termino buscado mediante `.includes()`.
  3. Para cada post coincidente, realiza una peticion asincrona a `/comments?postId=...` para obtener sus comentarios asociados.
  4. Presenta en la consola cada publicacion con su titulo, cuerpo, identificador de autor y la lista de comentarios agregados con el nombre y correo del comentarista.

### Ejercicio 4: Modificar Estructura de Usuarios
- Archivo: `modules/userTransformModule.js`
- Que hace:
  1. Consulta todos los usuarios registrados en `/users`.
  2. Utiliza el metodo funcional `.map()` para proyectar un nuevo arreglo donde cada elemento es un nuevo objeto que contiene estricta y unicamente las propiedades `nombre` (derivado de `user.name`) y `telefono` (derivado de `user.phone`).
  3. Muestra el resultado estructurado en una tabla limpia mediante `console.table()` y un fragmento en formato JSON.

### Ejercicio 5: Consulta Unica y Enriquecimiento Completo de Datos
- Archivo: `modules/dataEnrichmentModule.js`
- Que hace:
  1. Realiza una unica llamada de red para cada coleccion principal (`/users`, `/posts`, `/comments`, `/albums`, `/photos`) de forma paralela con `Promise.all`. Esto evita hacer mas de 5.000 peticiones individuales en cascada, protegiendo al servidor y ejecutandose en segundos.
  2. Indexa en memoria los comentarios por `postId` y las fotos por `albumId` utilizando estructuras `Map` (acceso en tiempo constante O(1)).
  3. Asocia a cada usuario sus publicaciones con sus respectivos comentarios, y sus albumes con sus respectivas fotografias.
  4. Muestra un balance consolidado general en la consola y despliega la jerarquia completa de cada usuario de forma organizada y legible.
  5. **No guarda ningun archivo en disco**, presentando toda la informacion directamente en la terminal con iconos limpios y sin URLs de imagenes.

---

## 4. Estructura del Proyecto

```text
evaluacion-asincronia-js/
├── package.json               # Configuracion ESM ("type": "module") y scripts
├── README.md                  # Documentacion explicativa y guia de aprendizaje
├── app.js                     # Punto de entrada de la aplicacion (Menu interactivo)
├── config/
│   └── apiConfig.js           # Configuracion centralizada de URLs y endpoints
├── utils/
│   ├── httpClient.js          # Envoltorio fetch reutilizable con try-catch (DRY)
│   └── consoleHelper.js       # Entrada no bloqueante por consola y utilidades
├── modules/
│   ├── pendingTasksModule.js  # Ejercicio 1
│   ├── userAlbumsModule.js    # Ejercicio 2
│   ├── filterPostsModule.js   # Ejercicio 3
│   ├── userTransformModule.js # Ejercicio 4
│   ├── dataEnrichmentModule.js# Ejercicio 5
│   └── index.js               # Archivo barril que agrupa y exporta todos los modulos
└── docs/
    └── RUBRICA_EVALUACION.md  # Matriz de cumplimiento contra el instrumento de evaluacion
```

---

## 5. Como Ejecutar la Aplicacion

1. Abra una terminal en la carpeta del proyecto.
2. Ejecute el siguiente comando:
   ```bash
   node app.js
   ```

3. Aparecera el menu interactivo en pantalla:
   ```text
   ================ MENU DE OPCIONES ================
   [1] tareas          - 📋 Listar tareas pendientes por cada usuario
   [2] albumes         - 📁 Busqueda de usuario, albumes y fotos
   [3] posts           - 📝 Filtrar posts por nombre y agregar comentarios
   [4] usuarios        - 👤 Modificar estructura de usuarios (solo nombre y tel)
   [5] enriquecimiento - 🔄 Consulta unica y enriquecimiento completo
   [0] salir           - 🚪 Finalizar ejecucion
   ==================================================
   ```

4. Puede ingresar el **numero** de la opcion (ejemplo: `1`) o el **nombre** del ejercicio (ejemplo: `tareas`).
5. Al finalizar la consulta, presione `[ENTER]` para volver al menu principal.
6. Ingrese `0` o `salir` para terminar el programa.
