import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

// Cluster
import cluster from 'cluster';
import os from 'os';

// Express
import express from 'express';
const app = express();

// Mids Import
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';

// Routes
import routes from './routes';

// Mids
app.use(express.json());
app.use(cors());
app.use(compression());
if (process.env.NODE_ENV == 'dev') {
    app.use(morgan('dev'));
}
app.use(routes);



// Cluster
if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    app.listen(process.env.HTTP_PORT || 3333);
}

export default app;