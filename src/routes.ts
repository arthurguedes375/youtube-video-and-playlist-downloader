// Node
import path from 'path';

// Express
import express from 'express';
const routes = express.Router();

// Middleware
import { downloadMiddleware } from './middlewares/download';

// Controllers
import youtubeController from '@controllers/youtubeController';
import fileController from '@controllers/fileController';

// Files
routes.use(
    '/downloads/playlists',
    downloadMiddleware.headers,
    express.static(path.resolve('saves', 'compressed')),
);
routes.use(
    '/downloads/videos',
    downloadMiddleware.headers,
    express.static(path.resolve('saves', 'videos')),
);

// Downloads
routes.post('/videos', youtubeController.video);
routes.post('/playlists', youtubeController.playlist);

export default routes;