// URL base de la API publica JSONPlaceholder
// Se define para centralizar la direccion del servidor y cumplir el principio DRY
export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Endpoints especificos utilizados para cada recurso de la API
// Soluciona el riesgo de errores tipograficos en las rutas de consulta
export const ENDPOINTS = Object.freeze({
  // Ruta para consultar los usuarios registrados
  USERS: `${API_BASE_URL}/users`,
  // Ruta para consultar las tareas asignadas a los usuarios
  TODOS: `${API_BASE_URL}/todos`,
  // Ruta para consultar las publicaciones
  POSTS: `${API_BASE_URL}/posts`,
  // Ruta para consultar los comentarios asociados a las publicaciones
  COMMENTS: `${API_BASE_URL}/comments`,
  // Ruta para consultar los albumes de los usuarios
  ALBUMS: `${API_BASE_URL}/albums`,
  // Ruta para consultar las fotografias de los albumes
  PHOTOS: `${API_BASE_URL}/photos`,
});

// Cabeceras HTTP estandar para solicitudes JSON
// Soluciona la interoperabilidad asegurando que el servidor responda en formato JSON
export const DEFAULT_HEADERS = Object.freeze({
  'Accept': 'application/json',
  'Content-Type': 'application/json; charset=UTF-8',
});
