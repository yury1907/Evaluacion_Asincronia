// Importa los endpoints de publicaciones y comentarios desde la configuracion
// Se codifica para unificar el acceso a rutas HTTP
import { ENDPOINTS } from '../config/apiConfig.js';
// Importa el cliente HTTP getJson para realizar peticiones asincronas con fetch
// Soluciona la reutilizacion de codigo de red y captura centralizada de errores
import { getJson } from '../utils/httpClient.js';
// Importa las utilidades de consola
import {
  solicitarTexto,
  imprimirEncabezado,
  imprimirExito,
  imprimirError,
  pausarParaContinuar,
} from '../utils/consoleHelper.js';

// Filtra las publicaciones que coincidan con un texto en su titulo y anexa sus comentarios
// Soluciona la busqueda de publicaciones con comentarios anidados
export async function filtrarPostsConComentarios(textoBusqueda) {
  try {
    const terminoLimpio = textoBusqueda.trim().toLowerCase();

    if (!terminoLimpio) {
      return [];
    }

    const todosLosPosts = await getJson(ENDPOINTS.POSTS);

    const postsCoincidentes = todosLosPosts.filter((post) =>
      post.title.toLowerCase().includes(terminoLimpio)
    );

    if (postsCoincidentes.length === 0) {
      return [];
    }

    // Consulta los comentarios para cada post coincidente de forma concurrente con Promise.all
    const postsEnriquecidos = await Promise.all(
      postsCoincidentes.map(async (post) => {
        const urlComentarios = `${ENDPOINTS.COMMENTS}?postId=${post.id}`;
        const comentarios = await getJson(urlComentarios);

        return {
          idPost: post.id,
          idAutor: post.userId,
          titulo: post.title,
          cuerpo: post.body,
          totalComentarios: comentarios.length,
          comentarios: comentarios.map((c) => ({
            idComentario: c.id,
            tituloComentario: c.name,
            correoAutor: c.email,
            contenido: c.body,
          })),
        };
      })
    );

    return postsEnriquecidos;
  } catch (error) {
    imprimirError(`Error al filtrar publicaciones: ${error.message}`);
    throw error;
  }
}

// Funcion controladora interactiva que ejecuta el Ejercicio 3
export async function ejecutarFiltrarPostsPorNombre() {
  imprimirEncabezado('Ejercicio 3: Filtrar Publicaciones por Nombre y Agregar Comentarios');

  try {
    console.log('Sugerencias de terminos de busqueda: "qui", "optio", "magnam", "dolor"...\n');
    const termino = await solicitarTexto('Ingrese el termino o nombre a buscar en los posts:');

    if (!termino) {
      imprimirError('Debe ingresar un termino valido para realizar la busqueda.');
      return;
    }

    console.log(`\nBuscando posts con "${termino}" y descargando comentarios...`);

    const resultados = await filtrarPostsConComentarios(termino);

    if (resultados.length === 0) {
      imprimirError(`No se encontraron publicaciones cuyo titulo contenga: "${termino}".`);
      return;
    }

    console.log('');
    imprimirExito(`Se encontraron ${resultados.length} publicacion(es) con "${termino}".\n`);

    // Muestra todas las publicaciones y todos sus comentarios completos
    resultados.forEach((post) => {
      console.log(`-------------------------------------------------------------`);
      console.log(`📝 [POST #${post.idPost}] Titulo: ${post.titulo}`);
      console.log(`   Autor ID: ${post.idAutor} | Total Comentarios: ${post.totalComentarios}`);
      console.log(`   Contenido: ${post.cuerpo.replace(/\n/g, ' ')}`);
      console.log(`   Comentarios asociados:`);

      post.comentarios.forEach((comentario) => {
        console.log(`     💬 ${comentario.tituloComentario} (${comentario.correoAutor}):`);
        console.log(`        "${comentario.contenido.replace(/\n/g, ' ')}"`);
      });

      console.log(`-------------------------------------------------------------\n`);
    });
  } catch (error) {
    imprimirError(`Error al ejecutar el Ejercicio 3: ${error.message}`);
  } finally {
    await pausarParaContinuar();
  }
}
