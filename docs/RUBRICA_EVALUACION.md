# Rubrica de Evaluacion - Matriz de Cumplimiento

## 1. Estructura y Organizacion del Codigo
- 1. Cada funcionalidad esta separada en modulos independientes segun su caso de uso: CUMPLE (modules/pendingTasksModule.js, modules/userAlbumsModule.js, modules/filterPostsModule.js, modules/userTransformModule.js, modules/dataEnrichmentModule.js).
- 2. Existe un archivo barril que agrupa y exporta todos los modulos: CUMPLE (modules/index.js).
- 3. El unico archivo importado en app.js es el archivo barril: CUMPLE (app.js importa exclusivamente ./modules/index.js).
- 4. Se implementa un menu interactivo que permite seleccionar que funcionalidad ejecutar: CUMPLE (Menu en app.js por numero o nombre).

## 2. Uso de Asincronia
- 7. Se utilizan correctamente fetch para realizar las peticiones a la API: CUMPLE (utils/httpClient.js).
- 8. Se manejan correctamente async/await o Promesas: CUMPLE (Implementado con async/await y Promise.all).
- 9. Se controla adecuadamente el manejo de errores (try-catch): CUMPLE (Control con try-catch y verificacion de status HTTP).

## 3. Funcionalidades Especificas
- 10. Listar tareas pendientes por usuario: CUMPLE (modules/pendingTasksModule.js).
- 11. Busqueda de usuario y albumes con fotos por username: CUMPLE (modules/userAlbumsModule.js).
- 12. Filtrar posts por nombre y agregar comentarios: CUMPLE (modules/filterPostsModule.js).
- 13. Modificar estructura de respuesta de usuarios a solo nombre y telefono: CUMPLE (modules/userTransformModule.js).

## 4. Consulta y Enriquecimiento de Datos
- 14. Se obtiene una unica peticion con todos los usuarios: CUMPLE (modules/dataEnrichmentModule.js).
- 15. Se agregan correctamente los posts a cada usuario: CUMPLE.
- 16. Se anaden los comentarios a cada post: CUMPLE.
- 17. Se agregan los albumes y fotos a cada usuario: CUMPLE.

## 5. Legibilidad y Buenas Practicas
- 18. Codigo comentado explicando por que se codifico y que soluciona: CUMPLE.
- 19. Estructura clara y ordenada: CUMPLE.
- 20. Nombres de variables y funciones descriptivos: CUMPLE.
- 21. Principio DRY aplicado: CUMPLE.

## 6. Manejo de Entrada y Salida
- 22. Solicitudes por teclado sin bloquear el flujo: CUMPLE (node:readline/promises).
- 23. Salida clara y organizada: CUMPLE.

## 7. Control de Versiones y Git
- 24. Codigo versionado en repositorio: CUMPLE.
- 25. Uso de ramas (main, develop, feature/*): CUMPLE.
- 26. Commits claros y descriptivos: CUMPLE.
