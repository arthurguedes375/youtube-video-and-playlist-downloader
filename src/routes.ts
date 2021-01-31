import express from 'express';
const routes = express.Router();


// Controllers
import youtubeController from '@controllers/youtubeController';

routes.post('/videos', youtubeController.video);

export default routes;