import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { logInfo, logError } from './utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PORT = process.env.PORT ? Number(process.env.PORT) : 5001;
export const VAULT_PATH = process.env.OBSIDIAN_PATH || path.join(__dirname, '..', '..');
export const POSTS_PATH = path.join(VAULT_PATH, 'Posts de Facebook');

export async function validatePaths() {
    if (!await fs.pathExists(VAULT_PATH)) {
        logError(`El vault no existe en la ruta: ${VAULT_PATH}`);
        logError('Verificá la variable de entorno OBSIDIAN_PATH en tu .env');
        process.exit(1);
    }

    await fs.ensureDir(POSTS_PATH);
    logInfo(`Vault: ${VAULT_PATH}`);
    logInfo(`Posts: ${POSTS_PATH}`);

}