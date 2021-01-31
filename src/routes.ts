import express from 'express';
const routes = express.Router();


// Controllers
import youtubeController from '@controllers/youtubeController';

routes.post('/videos', youtubeController.video);
routes.post('/playlists', youtubeController.playlist);

export default routes;