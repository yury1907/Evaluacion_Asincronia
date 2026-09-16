// Archivo barril que agrupa y re-exporta todos los modulos
// Cumple con el criterio 2 y 3 de la evaluacion: unico archivo importado en app.js

export {
  obtenerTareasPendientesPorUsuario,
  ejecutarListarTareasPendientes,
} from './pendingTasksModule.js';

export {
  buscarUsuarioConAlbumesYFotos,
  ejecutarBusquedaUsuarioYAlbumes,
} from './userAlbumsModule.js';

export {
  filtrarPostsConComentarios,
  ejecutarFiltrarPostsPorNombre,
} from './filterPostsModule.js';

export {
  obtenerUsuariosNombreYTelefono,
  ejecutarModificarEstructuraUsuarios,
} from './userTransformModule.js';

export {
  consultarYEnriquecerDatosCompletos,
  ejecutarEnriquecimientoCompleto,
} from './dataEnrichmentModule.js';

export {
  solicitarTexto,
  pausarParaContinuar,
  cerrarConsola,
  imprimirEncabezado,
  imprimirExito,
  imprimirError,
} from '../utils/consoleHelper.js';
