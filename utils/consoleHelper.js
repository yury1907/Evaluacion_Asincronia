// Modulo de utilidades para entrada y salida por consola sin bloqueos
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// Instancia persistente de readline para evitar cierres prematuros del flujo stdin
let interfazLectura = null;

// Obtiene o inicializa la interfaz de lectura
function obtenerInterfazLectura() {
  if (!interfazLectura || interfazLectura.closed) {
    interfazLectura = readline.createInterface({ input, output });
  }
  return interfazLectura;
}

// Cierra la interfaz de lectura al salir de la aplicacion
export function cerrarConsola() {
  if (interfazLectura && !interfazLectura.closed) {
    interfazLectura.close();
  }
}

// Solicita texto por teclado de manera asincrona
export async function solicitarTexto(promptText) {
  const rl = obtenerInterfazLectura();
  const respuesta = await rl.question(`${promptText} `);
  return respuesta.trim();
}

// Pausa la ejecucion hasta que el usuario presione Enter
export async function pausarParaContinuar() {
  const rl = obtenerInterfazLectura();
  await rl.question('\nPresione [ENTER] para regresar al menu...');
}

// Imprime un separador y titulo de seccion sin caracteres de color
export function imprimirEncabezado(titulo) {
  const separador = '------------------------------------------------------------';
  console.log(`\n${separador}`);
  console.log(`  ${titulo}`);
  console.log(`${separador}\n`);
}

// Imprime mensaje informativo de exito en texto plano con icono
export function imprimirExito(mensaje) {
  console.log(`✔ [EXITO] ${mensaje}`);
}

// Imprime mensaje de error en texto plano con icono
export function imprimirError(mensaje) {
  console.log(`✖ [ERROR] ${mensaje}`);
}
