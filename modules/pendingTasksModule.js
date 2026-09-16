// Importa los endpoints configurados para usuarios y tareas
// Se codifica para evitar la repeticion de rutas y mantener el codigo desacoplado
import { ENDPOINTS } from '../config/apiConfig.js';
// Importa la funcion getJson para realizar solicitudes asincronas seguras
// Soluciona la reutilizacion del cliente HTTP bajo el principio DRY
import { getJson } from '../utils/httpClient.js';
// Importa utilidades de consola para encabezados, texto y pausas
// Se codifica para estructurar la visualizacion en terminal sin colores
import { imprimirEncabezado, imprimirExito, imprimirError, pausarParaContinuar } from '../utils/consoleHelper.js';

// Obtiene y organiza la lista de tareas pendientes para cada usuario registrado
// Soluciona la agrupacion relacional entre la entidad usuario y sus tareas pendientes
export async function obtenerTareasPendientesPorUsuario() {
  try {
    // Ejecuta de forma concurrente las peticiones de usuarios y tareas mediante Promise.all
    // Se codifica con await para optimizar tiempos de respuesta evitando solicitudes en cascada
    const [usuarios, todasLasTareas] = await Promise.all([
      getJson(ENDPOINTS.USERS),
      getJson(ENDPOINTS.TODOS),
    ]);

    // Aplica el metodo filter sobre el arreglo de tareas para aislar unicamente las pendientes
    // Se codifica verificando que la propiedad completed sea estrictamente falsa (completed === false)
    const tareasPendientes = todasLasTareas.filter((tarea) => tarea.completed === false);

    // Mapea la lista de usuarios para anexar a cada uno su subconjunto de tareas pendientes
    const resultado = usuarios.map((usuario) => {
      // Filtra las tareas pendientes que corresponden al identificador (id) del usuario actual
      const tareasDelUsuario = tareasPendientes.filter((tarea) => tarea.userId === usuario.id);

      return {
        idUsuario: usuario.id,
        nombreCompleto: usuario.name,
        username: usuario.username,
        correo: usuario.email,
        totalPendientes: tareasDelUsuario.length,
        tareas: tareasDelUsuario.map((t) => ({
          idTarea: t.id,
          titulo: t.title,
        })),
      };
    });

    return resultado;
  } catch (error) {
    imprimirError(`No fue posible procesar las tareas pendientes: ${error.message}`);
    throw error;
  }
}

// Funcion controladora interactiva que ejecuta el Ejercicio 1 y formatea la salida en consola
export async function ejecutarListarTareasPendientes() {
  imprimirEncabezado('Ejercicio 1: Listar Tareas Pendientes por Cada Usuario');

  console.log('Consultando usuarios y tareas en JSONPlaceholder...\n');

  try {
    const usuariosConTareas = await obtenerTareasPendientesPorUsuario();

    imprimirExito(`Se obtuvieron exitosamente ${usuariosConTareas.length} usuarios con sus tareas pendientes.\n`);

    // Itera secuencialmente sobre cada usuario procesado mostrando todas sus tareas pendientes
    usuariosConTareas.forEach((user) => {
      console.log(`👤 Usuario #${user.idUsuario}: ${user.nombreCompleto} (@${user.username})`);
      console.log(`   Correo: ${user.correo} | Pendientes: ${user.totalPendientes}`);

      if (user.tareas.length === 0) {
        console.log(`   ✔ No tiene tareas pendientes.`);
      } else {
        user.tareas.forEach((tarea) => {
          console.log(`   📋 [ID: ${tarea.idTarea}] ${tarea.titulo}`);
        });
      }

      console.log('');
    });
  } catch (error) {
    imprimirError(`Error al ejecutar el Ejercicio 1: ${error.message}`);
  } finally {
    await pausarParaContinuar();
  }
}
