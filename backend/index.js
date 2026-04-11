import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PORT, VAULT_PATH, validatePaths } from './config.js';
import postsRouter from './routes/posts.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/images', express.static(VAULT_PATH, { dotfiles: 'deny', index: false }));

app.use('/api/posts', postsRouter);

validatePaths().then(() => {
  app.listen(PORT, () => {
    console.log('-----------------------------');
    console.log(`✅ INFO: Servidor corriendo en http://localhost:${PORT}`);
    console.log('-----------------------------');
  });
});