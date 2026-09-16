// Importa los endpoints requeridos para usuarios, albumes y fotos
// Se codifica para evitar valores en duro y centralizar la configuracion
import { ENDPOINTS } from '../config/apiConfig.js';
// Importa el cliente HTTP con promesas y manejo de errores
// Soluciona la invocacion segura de fetch bajo el principio DRY
import { getJson } from '../utils/httpClient.js';
// Importa utilidades de consola para interactuar en texto plano
import {
  solicitarTexto,
  imprimirEncabezado,
  imprimirExito,
  imprimirError,
  pausarParaContinuar,
} from '../utils/consoleHelper.js';

// Busca un usuario por su nombre de usuario (username) y anexa sus albumes con fotos
// Soluciona el requerimiento de consultar y unificar usuario, albumes y fotos en un solo resultado
export async function buscarUsuarioConAlbumesYFotos(usernameBuscado) {
  try {
    // Normaliza el termino de busqueda quitando espacios y pasando a minusculas
    // Permite busquedas insensibles a mayusculas/minusculas
    const terminoLimpio = usernameBuscado.trim().toLowerCase();

    // Valida que la entrada no este en blanco
    if (!terminoLimpio) {
      return null;
    }

    // Consulta la lista general de usuarios
    const usuarios = await getJson(ENDPOINTS.USERS);

    // Encuentra el usuario cuyo username coincida
    const usuarioEncontrado = usuarios.find(
      (u) => u.username.toLowerCase() === terminoLimpio
    );

    // Si el usuario no fue hallado, se detiene la busqueda
    if (!usuarioEncontrado) {
      return null;
    }

    // Consulta los albumes pertenecientes al usuario encontrado
    const urlAlbumes = `${ENDPOINTS.ALBUMS}?userId=${usuarioEncontrado.id}`;
    const albumes = await getJson(urlAlbumes);

    // Consulta las fotografias de cada album en paralelo utilizando Promise.all
    // Se codifica para evitar tiempos lentos de espera secuencial
    const albumesConFotos = await Promise.all(
      albumes.map(async (album) => {
        // Construye la URL para solicitar las fotos del album actual
        const urlFotos = `${ENDPOINTS.PHOTOS}?albumId=${album.id}`;
        const fotos = await getJson(urlFotos);

        // Retorna el album con su listado completo de fotografias
        return {
          idAlbum: album.id,
          tituloAlbum: album.title,
          totalFotos: fotos.length,
          fotos: fotos.map((f) => ({
            idFoto: f.id,
            tituloFoto: f.title,
          })),
        };
      })
    );

    // Construye el objeto integral unificando los datos del usuario con sus albumes y fotos
    const resultadoCompleto = {
      id: usuarioEncontrado.id,
      nombre: usuarioEncontrado.name,
      username: usuarioEncontrado.username,
      email: usuarioEncontrado.email,
      telefono: usuarioEncontrado.phone,
      sitioWeb: usuarioEncontrado.website,
      direccion: usuarioEncontrado.address,
      empresa: usuarioEncontrado.company,
      totalAlbumes: albumesConFotos.length,
      albumes: albumesConFotos,
    };

    return resultadoCompleto;
  } catch (error) {
    imprimirError(`Error al consultar el usuario y sus albumes: ${error.message}`);
    throw error;
  }
}

// Funcion controladora interactiva que ejecuta el Ejercicio 2
export async function ejecutarBusquedaUsuarioYAlbumes() {
  imprimirEncabezado('Ejercicio 2: Busqueda de Usuario, Albumes y Fotografias');

  try {
    console.log('Ejemplos de username en la API: Bret, Antonette, Samantha, Karianne, Kamren...\n');
    const usernameIngresado = await solicitarTexto('Ingrese el username a buscar:');

    if (!usernameIngresado) {
      imprimirError('El username no puede estar vacio. Intente nuevamente.');
      return;
    }

    console.log(`\nBuscando usuario "${usernameIngresado}" y recopilando albumes y fotos...`);

    const datosUsuario = await buscarUsuarioConAlbumesYFotos(usernameIngresado);

    if (!datosUsuario) {
      imprimirError(`No se encontro ningun usuario con el username: "${usernameIngresado}".`);
      return;
    }

    console.log('');
    imprimirExito(`Usuario encontrado: ${datosUsuario.nombre} (@${datosUsuario.username})`);

    // Muestra los datos del usuario con icono sencillo
    console.log('\n👤 DATOS DEL USUARIO:');
    console.log(`ID:           ${datosUsuario.id}`);
    console.log(`Nombre:       ${datosUsuario.nombre}`);
    console.log(`Username:     ${datosUsuario.username}`);
    console.log(`Correo:       ${datosUsuario.email}`);
    console.log(`Telefono:     ${datosUsuario.telefono}`);
    console.log(`Sitio Web:    ${datosUsuario.sitioWeb}`);
    console.log(`Ciudad:       ${datosUsuario.direccion?.city}`);
    console.log(`Empresa:      ${datosUsuario.empresa?.name}`);
    console.log(`Total Albumes: ${datosUsuario.totalAlbumes}`);
    console.log('------------------------------------------------------------\n');

    console.log('📁 ALBUMES Y FOTOGRAFIAS ASOCIADAS:\n');

    // Despliega todos los albumes y la totalidad de sus fotos sin recortar ni incluir enlaces url
    datosUsuario.albumes.forEach((album) => {
      console.log(`📁 [Album #${album.idAlbum}] "${album.tituloAlbum}" (${album.totalFotos} fotos):`);

      // Muestra todas las fotos del album una a una sin truncar
      album.fotos.forEach((foto) => {
        console.log(`  📷 Foto #${foto.idFoto}: ${foto.tituloFoto}`);
      });

      console.log('');
    });
  } catch (error) {
    imprimirError(`Ocurrio un error en la ejecucion: ${error.message}`);
  } finally {
    await pausarParaContinuar();
  }
}
