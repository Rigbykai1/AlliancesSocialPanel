import { Router } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { upload } from '../middleware/upload.js';
import { getPostPaths } from '../utils/paths.js';
import { parseMD, generarMarkdown, limpiarImagen } from '../utils/markdown.js';
import { logInfo, logWarn, logError } from '../utils/logger.js';

const router = Router();

// ================== GET POSTS ==================
router.get('/', async (req, res) => {
  try {
    logInfo('Leyendo posts...');
    const { POSTS_PATH } = await import('../config.js');
    const posts = [];
    const años = await fs.readdir(POSTS_PATH);

    for (const año of años) {
      const añoPath = path.join(POSTS_PATH, año);
      if (!(await fs.stat(añoPath)).isDirectory()) continue;

      const meses = await fs.readdir(añoPath);
      for (const mes of meses) {
        const mesPath = path.join(añoPath, mes);
        if (!(await fs.stat(mesPath)).isDirectory()) continue;

        const archivos = await fs.readdir(mesPath);
        for (const archivo of archivos) {
          if (!archivo.endsWith('.md')) continue;

          const ruta = path.join(mesPath, archivo);
          const contenido = await fs.readFile(ruta, 'utf-8');
          const { frontmatter, body } = parseMD(contenido);

          const imageName = limpiarImagen(frontmatter['Imagen del post']);
          let imageUrl = null;

          if (imageName && frontmatter['Fecha de publicación']) {
            const { imageRelPath } = getPostPaths(frontmatter['Fecha de publicación']);
            imageUrl = `/images/${encodeURI(`${imageRelPath}/${imageName}`)}?t=${Date.now()}`;
          }

          posts.push({
            id: archivo.replace('.md', ''),
            nombre: archivo,
            ...frontmatter,
            imageName,
            imageUrl,
            preview: body.substring(0, 200),
            contenido: body
          });
        }
      }
    }

    posts.sort((a, b) =>
      new Date(b['Fecha de publicación'] || 0) - new Date(a['Fecha de publicación'] || 0)
    );

    logInfo(`Total de posts encontrados: ${posts.length}`);
    res.json(posts);
  } catch (error) {
    logError(`Error al leer posts: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ================== CREAR POST ==================
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const { titulo, fecha, tipo, contenido } = req.body;

    if (!fecha) {
      logWarn('Intento de crear post sin fecha');
      return res.status(400).json({ error: 'La fecha es requerida' });
    }

    // Calcular sufijo contando archivos existentes para esa fecha
    const { postFolder } = getPostPaths(fecha);
    await fs.ensureDir(postFolder);

    const archivosExistentes = await fs.readdir(postFolder).catch(() => [])
    const { fileName: fileNameBase } = getPostPaths(fecha)
    const baseNameSinExt = fileNameBase.replace('.md', '')  // "Post 11 abril 2026"

    const coincidencias = archivosExistentes.filter(f =>
      f === `${baseNameSinExt}.md` ||           // el original sin sufijo
      f.match(new RegExp(`^${baseNameSinExt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\d+\\.md$`))
    )
    const sufijo = coincidencias.length  // 0 → sin sufijo, 1 → " 1", 2 → " 2"...

    const { fileName, filePath, imageFolder, imageName } = getPostPaths(fecha, sufijo === 0 ? '' : sufijo)

    const imagen = req.file ? req.file.filename : null;

    // Mover imagen con nombre correcto si existe
    if (req.file) {
      const ext = path.extname(req.file.filename)
      const nombreCanonico = `${imageName}${ext}`
      const rutaSubida = path.resolve(req.file.path)
      const rutaDestino = path.resolve(path.join(imageFolder, nombreCanonico))
      await fs.ensureDir(imageFolder)
      if (rutaSubida !== rutaDestino) {
        await fs.move(rutaSubida, rutaDestino, { overwrite: false })
      }
    }

    const frontmatter = {
      'Tipo de formato': tipo || '',
      'Fecha de publicación': fecha,
      'Imagen del post': imagen ? `[[${imageName}${path.extname(imagen)}]]` : '',
      'Publicado': false
    };

    await fs.writeFile(filePath, generarMarkdown(frontmatter, contenido || ''), 'utf-8');

    logInfo(`Post creado: ${fileName} — imagen: ${imagen || 'ninguna'}`);
    res.json({ exito: true, id: fileName.replace('.md', ''), imagen });
  } catch (error) {
    logError(`Error al crear post: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ================== EDITAR POST ==================
router.put('/:id', upload.single('imagen'), async (req, res) => {
  try {
    const { POSTS_PATH, VAULT_PATH } = await import('../config.js');
    const idOriginal = req.params.id;
    const { fecha, tipo, contenido, fechaOriginal, publicado } = req.body;

    if (!fecha) return res.status(400).json({ error: 'La fecha es requerida' });
    if (!fechaOriginal) return res.status(400).json({ error: 'La fecha original es requerida' });

    // ── Rutas originales (para encontrar el archivo actual) ──────────────────
    const { postFolder: carpetaOrig } = getPostPaths(fechaOriginal);
    const rutaArchivoOrig = path.join(carpetaOrig, `${idOriginal}.md`);

    if (!await fs.pathExists(rutaArchivoOrig)) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    // ── Leer contenido actual ────────────────────────────────────────────────
    const contenidoActual = await fs.readFile(rutaArchivoOrig, 'utf-8');
    const { frontmatter: fmActual } = parseMD(contenidoActual);
    const imagenActual = limpiarImagen(fmActual['Imagen del post']);

    // ── Calcular sufijo para las rutas nuevas ────────────────────────────────
    // Extraer sufijo del id original: "Post 27 abril 2026 1" → 1, "Post 27 abril 2026" → ''
    const matchSufijo = idOriginal.match(/\s(\d+)$/)
    const sufijoOriginal = matchSufijo ? Number(matchSufijo[1]) : ''

    let sufijo = sufijoOriginal  // por defecto conservar el sufijo

    if (fecha !== fechaOriginal) {
      // La fecha cambió → recalcular sufijo contando archivos en la carpeta destino
      // (excluyendo el archivo original en caso de que sea la misma carpeta)
      const { postFolder: carpetaDestino, fileName: fileNameBase } = getPostPaths(fecha)
      await fs.ensureDir(carpetaDestino)

      const archivosExistentes = await fs.readdir(carpetaDestino).catch(() => [])
      const baseNameSinExt = fileNameBase.replace('.md', '')
      const escapado = baseNameSinExt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

      const coincidencias = archivosExistentes.filter(f =>
        f === `${baseNameSinExt}.md` ||
        f.match(new RegExp(`^${escapado} \\d+\\.md$`))
      )
      sufijo = coincidencias.length === 0 ? '' : coincidencias.length
    }

    // ── Rutas nuevas (con sufijo correcto) ───────────────────────────────────
    const {
      postFolder: carpetaNueva,
      fileName: fileNameNuevo,
      filePath: rutaArchNueva,
      imageFolder: imgCarpetaNueva,
      imageName: imgBaseNuevo
    } = getPostPaths(fecha, sufijo)

    // ── Resolver imagen ──────────────────────────────────────────────────────
    let imagenFinal = null;

    if (req.file) {
      // Subieron imagen nueva → renombrarla con nombre canónico y moverla al vault
      const ext = path.extname(req.file.filename);
      const nombreCanónico = `${imgBaseNuevo}${ext}`;
      const rutaSubida = path.resolve(req.file.path);
      const rutaDestino = path.resolve(path.join(imgCarpetaNueva, nombreCanónico));

      await fs.ensureDir(imgCarpetaNueva);

      if (rutaSubida !== rutaDestino) {
        await fs.move(rutaSubida, rutaDestino, { overwrite: true });
        logInfo(`Imagen nueva guardada: ${rutaDestino}`);
      }

      // Borrar imagen vieja del vault si existe y es distinta
      if (imagenActual) {
        const { imageFolder: imgCarpetaOrig2 } = getPostPaths(fechaOriginal);
        const rutaImgVieja = path.resolve(path.join(imgCarpetaOrig2, imagenActual));
        if (rutaImgVieja !== rutaDestino && await fs.pathExists(rutaImgVieja)) {
          await fs.remove(rutaImgVieja);
          logInfo(`Imagen vieja eliminada: ${rutaImgVieja}`);
        }
      }

      imagenFinal = nombreCanónico;

    } else if (imagenActual) {
      // No subieron imagen nueva → renombrar/mover la existente si cambió la fecha o el sufijo
      const ext = path.extname(imagenActual);
      const nombreCanónico = `${imgBaseNuevo}${ext}`;
      const { imageFolder: imgCarpetaOrig2 } = getPostPaths(fechaOriginal);
      const rutaImgOrig = path.resolve(path.join(imgCarpetaOrig2, imagenActual));
      const rutaImgNueva = path.resolve(path.join(imgCarpetaNueva, nombreCanónico));

      if (rutaImgOrig !== rutaImgNueva) {
        if (await fs.pathExists(rutaImgOrig)) {
          await fs.ensureDir(imgCarpetaNueva);
          await fs.move(rutaImgOrig, rutaImgNueva, { overwrite: true });
          logInfo(`Imagen movida: ${rutaImgOrig} → ${rutaImgNueva}`);
        }
      } else {
        logInfo(`Imagen sin cambios: ${rutaImgOrig}`);
      }

      imagenFinal = nombreCanónico;
    }

    // ── Escribir el archivo nuevo ────────────────────────────────────────────
    const frontmatter = {
      ...fmActual,
      'Tipo de formato': tipo || fmActual['Tipo de formato'] || '',
      'Fecha de publicación': fecha,
      'Imagen del post': imagenFinal ? `[[${imagenFinal}]]` : '',
      'Publicado': publicado === 'true',
    }

    await fs.ensureDir(carpetaNueva);
    await fs.writeFile(rutaArchNueva, generarMarkdown(frontmatter, contenido || ''), 'utf-8');

    // ── Borrar el archivo original si cambió el nombre/carpeta ───────────────
    if (path.resolve(rutaArchivoOrig) !== path.resolve(rutaArchNueva)) {
      await fs.remove(rutaArchivoOrig);
      logInfo(`Archivo original eliminado: ${rutaArchivoOrig}`);
    }

    const nuevoId = fileNameNuevo.replace('.md', '');
    logInfo(`Post actualizado: ${idOriginal} → ${nuevoId}`);
    res.json({ exito: true, id: nuevoId });
  } catch (error) {
    logError(`Error al actualizar post: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ================== ELIMINAR POST ==================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha } = req.query;

    if (!fecha) return res.status(400).json({ error: 'Se requiere el parámetro fecha en la query' });

    const { postFolder, imageRelPath } = getPostPaths(fecha);
    const rutaArchivo = path.join(postFolder, `${id}.md`);

    if (!await fs.pathExists(rutaArchivo)) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    const contenidoActual = await fs.readFile(rutaArchivo, 'utf-8');
    const { frontmatter } = parseMD(contenidoActual);
    const imageName = limpiarImagen(frontmatter['Imagen del post']);

    await fs.remove(rutaArchivo);

    if (imageName) {
      // Usar la ruta del vault, igual que en el PUT
      const { imageFolder } = getPostPaths(fecha);
      const rutaImagen = path.resolve(path.join(imageFolder, imageName));
      if (await fs.pathExists(rutaImagen)) {
        await fs.remove(rutaImagen);
        logInfo(`Imagen eliminada: ${rutaImagen}`);
      }
    }

    logInfo(`Post eliminado: ${id}`);
    res.json({ exito: true });
  } catch (error) {
    logError(`Error al eliminar post: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;