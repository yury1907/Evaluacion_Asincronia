// Punto de entrada de la aplicacion
// Cumple con el criterio: el unico archivo importado en app.js es el archivo barril
import {
  ejecutarListarTareasPendientes,
  ejecutarBusquedaUsuarioYAlbumes,
  ejecutarFiltrarPostsPorNombre,
  ejecutarModificarEstructuraUsuarios,
  ejecutarEnriquecimientoCompleto,
  solicitarTexto,
  cerrarConsola,
  imprimirError,
} from './modules/index.js';

// Muestra el menu de opciones por consola con iconos sencillos
function mostrarMenuOpciones() {
  console.log('\n================ MENU DE OPCIONES ================');
  console.log('[1] tareas          - 📋 Listar tareas pendientes por cada usuario');
  console.log('[2] albumes         - 📁 Busqueda de usuario, albumes y fotos');
  console.log('[3] posts           - 📝 Filtrar posts por nombre y agregar comentarios');
  console.log('[4] usuarios        - 👤 Modificar estructura de usuarios (solo nombre y tel)');
  console.log('[5] enriquecimiento - 🔄 Consulta unica y enriquecimiento completo');
  console.log('[0] salir           - 🚪 Finalizar ejecucion');
  console.log('==================================================\n');
}

// Normaliza la opcion ingresada por teclado, aceptando numero o nombre
function normalizarOpcion(opcionTexto) {
  const entrada = opcionTexto.trim().toLowerCase();

  if (entrada === '1' || entrada === 'tareas' || entrada === 'tarea') return 1;
  if (entrada === '2' || entrada === 'albumes' || entrada === 'album' || entrada === 'usuario') return 2;
  if (entrada === '3' || entrada === 'posts' || entrada === 'post') return 3;
  if (entrada === '4' || entrada === 'usuarios' || entrada === 'usuario-tel') return 4;
  if (entrada === '5' || entrada === 'enriquecimiento' || entrada === 'completo') return 5;
  if (entrada === '0' || entrada === 'salir' || entrada === 'exit') return 0;

  return null;
}

// Bucle interactivo principal
async function iniciarAplicacion() {
  let continuar = true;

  while (continuar) {
    mostrarMenuOpciones();
    const respuesta = await solicitarTexto('Seleccione una opcion (numero o nombre):');
    const opcion = normalizarOpcion(respuesta);

    switch (opcion) {
      case 1:
        await ejecutarListarTareasPendientes();
        break;
      case 2:
        await ejecutarBusquedaUsuarioYAlbumes();
        break;
      case 3:
        await ejecutarFiltrarPostsPorNombre();
        break;
      case 4:
        await ejecutarModificarEstructuraUsuarios();
        break;
      case 5:
        await ejecutarEnriquecimientoCompleto();
        break;
      case 0:
        continuar = false;
        cerrarConsola();
        console.log('\nPrograma finalizado correctamente.\n');
        break;
      default:
        imprimirError(`Opcion "${respuesta}" no valida. Ingrese un numero (0 al 5) o el nombre del ejercicio.`);
        break;
    }
  }
}

// Inicializa la aplicacion
iniciarAplicacion().catch((err) => {
  cerrarConsola();
  console.error('Error no controlado:', err.message);
});
