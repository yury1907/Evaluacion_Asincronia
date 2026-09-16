// Importa las cabeceras por defecto desde la configuracion global
// Se codifica para unificar el envio de metadatos HTTP en cada peticion
import { DEFAULT_HEADERS } from '../config/apiConfig.js';

// Realiza una peticion GET asincrona hacia una URL especificada
// Soluciona la reutilizacion del cliente HTTP bajo el principio DRY
export async function getJson(url, customHeaders = {}) {
  // Inicio del bloque try-catch para capturar fallos de red o respuestas no exitosas
  // Soluciona la interrupcion abrupta del sistema ante errores de comunicacion
  try {
    // Realiza la peticion asincrona mediante la funcion nativa fetch
    // Se codifica usando await para esperar la resolucion de la promesa de red
    const response = await fetch(url, {
      method: 'GET',
      headers: { ...DEFAULT_HEADERS, ...customHeaders },
    });

    // Valida si el codigo de estado HTTP se encuentra en el rango exitoso (200 - 299)
    // Soluciona el procesamiento incorrecto de respuestas de error
    if (!response.ok) {
      // Lanza una excepcion detallada con el codigo de estado y el mensaje del servidor
      throw new Error(`Error en peticion HTTP: ${response.status} ${response.statusText} en ${url}`);
    }

    // Convierte el cuerpo de la respuesta en un objeto JavaScript de forma asincrona
    // Se codifica con await porque la lectura del flujo de datos toma tiempo
    const data = await response.json();

    // Retorna los datos procesados y listos para su uso
    return data;
  } catch (error) {
    // Registra el error en la consola
    console.error(`[Cliente HTTP] Ocurrio un error al consultar: ${url}`);
    // Re-lanza el error para permitir su gestion en capas superiores
    throw error;
  }
}
