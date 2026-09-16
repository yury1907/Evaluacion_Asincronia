// Importa el endpoint centralizado para la consulta de usuarios
// Se codifica para evitar quemar cadenas literales y favorecer la mantenibilidad
import { ENDPOINTS } from '../config/apiConfig.js';
// Importa la funcion de peticion HTTP con promesas y manejo de errores
// Soluciona la invocacion segura y estandarizada de fetch
import { getJson } from '../utils/httpClient.js';
// Importa las utilidades de consola
import {
  imprimirEncabezado,
  imprimirExito,
  imprimirError,
  pausarParaContinuar,
} from '../utils/consoleHelper.js';

// Consulta todos los usuarios y genera un nuevo arreglo unicamente con nombre y telefono
// Cumple estrictamente con el requerimiento de retornar solo nombre y telefono
export async function obtenerUsuariosNombreYTelefono() {
  try {
    // Realiza la peticion asincrona hacia el endpoint de usuarios de la API
    const usuarios = await getJson(ENDPOINTS.USERS);

    // Transforma el arreglo original mediante el metodo funcional map
    // Soluciona la mutacion inmutable proyectando solo las dos propiedades requeridas
    const usuariosSimplificados = usuarios.map((usuario) => {
      return {
        nombre: usuario.name,
        telefono: usuario.phone,
      };
    });

    // Retorna la coleccion simplificada resultante
    return usuariosSimplificados;
  } catch (error) {
    imprimirError(`Error al consultar y transformar usuarios: ${error.message}`);
    throw error;
  }
}

// Funcion controladora interactiva que ejecuta el Ejercicio 4
export async function ejecutarModificarEstructuraUsuarios() {
  imprimirEncabezado('Ejercicio 4: Modificar Estructura de Usuarios (Solo Nombre y Telefono)');

  console.log('Consultando usuarios y transformando estructura de datos...\n');

  try {
    const usuariosReducidos = await obtenerUsuariosNombreYTelefono();

    imprimirExito(`Se genero exitosamente el arreglo con ${usuariosReducidos.length} registros estructurados.\n`);

    // Imprime la tabla mediante console.table nativo sin estilos de color
    console.table(usuariosReducidos);

    // Muestra una muestra del objeto JSON resultante
    console.log('\nMuestra de la estructura JSON generada (Primeros 2 registros):');
    console.log(JSON.stringify(usuariosReducidos.slice(0, 2), null, 2));
  } catch (error) {
    imprimirError(`Error al ejecutar el Ejercicio 4: ${error.message}`);
  } finally {
    await pausarParaContinuar();
  }
}
