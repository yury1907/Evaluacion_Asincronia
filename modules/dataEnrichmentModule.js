// Importa los endpoints de la API centralizados en la configuracion
// Se codifica para evitar quemar strings dispersos y garantizar DRY
import { ENDPOINTS } from '../config/apiConfig.js';
// Importa la funcion de peticion HTTP segura con fetch y promesas
import { getJson } from '../utils/httpClient.js';
// Importa las utilidades de consola
import {
  imprimirEncabezado,
  imprimirExito,
  imprimirError,
  pausarParaContinuar,
} from '../utils/consoleHelper.js';

// Consulta y construye la estructura completa de datos enriquecidos
// Cumple con el criterio de obtener los usuarios en una unica peticion inicial
export async function consultarYEnriquecerDatosCompletos() {
  try {
    console.log('Descargando colecciones maestras (usuarios, posts, comentarios, albumes, fotos)...');

    // Realiza la peticion de usuarios en paralelo con las demas colecciones usando Promise.all
    // Soluciona el problema de latencia al descargar recursos concurrentemente
    const [usuarios, todosLosPosts, todosLosComentarios, todosLosAlbumes, todasLasFotos] =
      await Promise.all([
        getJson(ENDPOINTS.USERS),
        getJson(ENDPOINTS.POSTS),
        getJson(ENDPOINTS.COMMENTS),
        getJson(ENDPOINTS.ALBUMS),
        getJson(ENDPOINTS.PHOTOS),
      ]);

    // Construye un indice Map para agrupar comentarios por el id del post
    // Optimiza la busqueda de comentarios a complejidad O(1)
    const mapaComentariosPorPost = new Map();
    todosLosComentarios.forEach((comentario) => {
      if (!mapaComentariosPorPost.has(comentario.postId)) {
        mapaComentariosPorPost.set(comentario.postId, []);
      }
      mapaComentariosPorPost.get(comentario.postId).push({
        idComentario: comentario.id,
        titulo: comentario.name,
        correo: comentario.email,
        cuerpo: comentario.body,
      });
    });

    // Construye un indice Map para agrupar fotografias por el id del album sin URLs
    const mapaFotosPorAlbum = new Map();
    todasLasFotos.forEach((foto) => {
      if (!mapaFotosPorAlbum.has(foto.albumId)) {
        mapaFotosPorAlbum.set(foto.albumId, []);
      }
      mapaFotosPorAlbum.get(foto.albumId).push({
        idFoto: foto.id,
        titulo: foto.title,
      });
    });

    // Construye un indice Map para agrupar los posts por el id del usuario
    // Integra a cada post sus comentarios correspondientes
    const mapaPostsPorUsuario = new Map();
    todosLosPosts.forEach((post) => {
      if (!mapaPostsPorUsuario.has(post.userId)) {
        mapaPostsPorUsuario.set(post.userId, []);
      }
      const comentariosDelPost = mapaComentariosPorPost.get(post.id) || [];
      mapaPostsPorUsuario.get(post.userId).push({
        idPost: post.id,
        titulo: post.title,
        cuerpo: post.body,
        totalComentarios: comentariosDelPost.length,
        comentarios: comentariosDelPost,
      });
    });

    // Construye un indice Map para agrupar albumes por usuario integrando sus fotos
    const mapaAlbumesPorUsuario = new Map();
    todosLosAlbumes.forEach((album) => {
      if (!mapaAlbumesPorUsuario.has(album.userId)) {
        mapaAlbumesPorUsuario.set(album.userId, []);
      }
      const fotosDelAlbum = mapaFotosPorAlbum.get(album.id) || [];
      mapaAlbumesPorUsuario.get(album.userId).push({
        idAlbum: album.id,
        titulo: album.title,
        totalFotos: fotosDelAlbum.length,
        fotos: fotosDelAlbum,
      });
    });

    // Construye el arreglo maestro enriquecido sobre la coleccion de usuarios
    const usuariosEnriquecidos = usuarios.map((usuario) => {
      const postsUsuario = mapaPostsPorUsuario.get(usuario.id) || [];
      const albumesUsuario = mapaAlbumesPorUsuario.get(usuario.id) || [];

      return {
        id: usuario.id,
        nombre: usuario.name,
        username: usuario.username,
        email: usuario.email,
        telefono: usuario.phone,
        sitioWeb: usuario.website,
        direccion: usuario.address,
        empresa: usuario.company,
        estadisticas: {
          totalPosts: postsUsuario.length,
          totalComentariosEnPosts: postsUsuario.reduce((acum, p) => acum + p.totalComentarios, 0),
          totalAlbumes: albumesUsuario.length,
          totalFotosEnAlbumes: albumesUsuario.reduce((acum, a) => acum + a.totalFotos, 0),
        },
        posts: postsUsuario,
        albumes: albumesUsuario,
      };
    });

    return usuariosEnriquecidos;
  } catch (error) {
    imprimirError(`Error durante el enriquecimiento de datos: ${error.message}`);
    throw error;
  }
}

// Funcion controladora interactiva que ejecuta el Ejercicio 5
export async function ejecutarEnriquecimientoCompleto() {
  imprimirEncabezado('Ejercicio 5: Consulta Unica y Enriquecimiento Completo de Datos');

  try {
    const resultadoCompleto = await consultarYEnriquecerDatosCompletos();

    imprimirExito(`Enriquecimiento finalizado exitosamente para ${resultadoCompleto.length} usuarios.`);

    const totalGlobalPosts = resultadoCompleto.reduce((acc, u) => acc + u.estadisticas.totalPosts, 0);
    const totalGlobalComentarios = resultadoCompleto.reduce((acc, u) => acc + u.estadisticas.totalComentariosEnPosts, 0);
    const totalGlobalAlbumes = resultadoCompleto.reduce((acc, u) => acc + u.estadisticas.totalAlbumes, 0);
    const totalGlobalFotos = resultadoCompleto.reduce((acc, u) => acc + u.estadisticas.totalFotosEnAlbumes, 0);

    console.log('\n================== BALANCE GENERAL DE DATOS ENRIQUECIDOS ==================');
    console.log(`Total Usuarios Consultados:     ${resultadoCompleto.length}`);
    console.log(`Total Publicaciones (Posts):    ${totalGlobalPosts}`);
    console.log(`Total Comentarios Asociados:    ${totalGlobalComentarios}`);
    console.log(`Total Albumes Asignados:        ${totalGlobalAlbumes}`);
    console.log(`Total Fotografias Asignadas:    ${totalGlobalFotos}`);
    console.log('===========================================================================\n');

    // Despliega la totalidad de los datos para cada usuario sin recortes ni enlaces
    resultadoCompleto.forEach((u) => {
      console.log('---------------------------------------------------------------------------');
      console.log(`👤 USUARIO #${u.id}: ${u.nombre} (@${u.username})`);
      console.log(`   Correo: ${u.email} | Telefono: ${u.telefono} | Web: ${u.sitioWeb}`);
      console.log(`   Ciudad: ${u.direccion?.city} | Empresa: ${u.empresa?.name}`);
      console.log(`   Total Posts: ${u.estadisticas.totalPosts} | Comentarios: ${u.estadisticas.totalComentariosEnPosts} | Albumes: ${u.estadisticas.totalAlbumes} | Fotos: ${u.estadisticas.totalFotosEnAlbumes}`);
      console.log('---------------------------------------------------------------------------');

      // Publicaciones completas con todos sus comentarios
      console.log('\n  📝 PUBLICACIONES Y COMENTARIOS ASOCIADOS:');
      u.posts.forEach((post) => {
        console.log(`     📝 [Post #${post.idPost}] "${post.titulo}"`);
        console.log(`        Cuerpo: ${post.cuerpo.replace(/\n/g, ' ')}`);
        console.log(`        Comentarios (${post.totalComentarios}):`);
        post.comentarios.forEach((c) => {
          console.log(`          💬 ${c.titulo} (${c.correo}):`);
          console.log(`             "${c.cuerpo.replace(/\n/g, ' ')}"`);
        });
      });

      // Albumes completos con todas sus fotos (sin enlaces url)
      console.log('\n  📁 ALBUMES Y FOTOGRAFIAS ASOCIADAS:');
      u.albumes.forEach((album) => {
        console.log(`     📁 [Album #${album.idAlbum}] "${album.titulo}" (${album.totalFotos} fotos):`);
        album.fotos.forEach((foto) => {
          console.log(`       📷 Foto #${foto.idFoto}: ${foto.titulo}`);
        });
      });

      console.log('\n');
    });

  } catch (error) {
    imprimirError(`Error al ejecutar el Ejercicio 5: ${error.message}`);
  } finally {
    await pausarParaContinuar();
  }
}
