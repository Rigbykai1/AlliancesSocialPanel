import path from 'path';
import multer from 'multer';
import fs from 'fs-extra';
import { getPostPaths } from '../utils/paths.js';
import { logInfo, logError } from '../utils/logger.js';

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { fecha } = req.body;
      if (!fecha) return cb(new Error('La fecha es requerida para subir imágenes'), null);
      const { imageFolder } = getPostPaths(fecha);
      await fs.ensureDir(imageFolder);
      logInfo(`Directorio de imagen asegurado: ${imageFolder}`);
      cb(null, imageFolder);
    } catch (err) {
      logError(`Error en destino de subida: ${err.message}`);
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    try {
      const { fecha } = req.body;
      const { imageName } = getPostPaths(fecha);
      const ext = path.extname(file.originalname).toLowerCase();
      const finalName = `${imageName}${ext}`;
      logInfo(`Imagen guardada como: ${finalName}`);
      cb(null, finalName);
    } catch (err) {
      logError(`Error al generar nombre de imagen: ${err.message}`);
      cb(err, null);
    }
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
  }
};

export const upload = multer({ storage, fileFilter });