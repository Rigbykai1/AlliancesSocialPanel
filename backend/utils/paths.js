import path from 'path';
import { VAULT_PATH, POSTS_PATH } from '../config.js';

export function getMonthName(month) {
  const names = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return names[month - 1];
}

/**
 * Calcula todas las rutas derivadas de una fecha.
 *
 * Posts (.md):  carpetas "01 - Enero"  (mayúscula, espacios)
 * Imágenes:     carpetas "01-enero"    (minúscula, sin espacios)
 */
export function getPostPaths(fechaInput, sufijo = '') {
  const fecha = fechaInput instanceof Date ? fechaInput : new Date(fechaInput);

  const year = fecha.getUTCFullYear();
  const month = fecha.getUTCMonth() + 1;
  const day = fecha.getUTCDate();

  const monthName = getMonthName(month);
  const dayStr = String(day).padStart(2, '0');

  const sufijoStr = sufijo !== '' ? ` ${sufijo}` : ''  // " 0", " 1", " 2"...

  // Posts: "01 - Enero"
  const postMonthStr = `${String(month).padStart(2, '0')}-${monthName}`;
  const postFolder = path.join(POSTS_PATH, String(year), postMonthStr);
  const fileName = `Post ${dayStr} ${monthName.toLowerCase()} ${year}${sufijoStr}.md`;
  const filePath = path.join(postFolder, fileName);

  // Imágenes: "01-enero"
  const imageMonthStr = `${String(month).padStart(2, '0')}-${monthName.toLowerCase()}`;
  const imageFolder = path.join(VAULT_PATH, 'Recursos visuales', 'Posts de Facebook', String(year), imageMonthStr);
  const imageName = `Post ${dayStr} ${monthName.toLowerCase()} ${year}${sufijoStr}`;
  const imageRelPath = `Recursos visuales/Posts de Facebook/${year}/${imageMonthStr}`;

  return { year, month, day, monthName, postFolder, fileName, filePath, imageFolder, imageName, imageRelPath };
}