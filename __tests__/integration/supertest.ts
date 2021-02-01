import supertest from 'supertest';
import expressServer from '@src/server';


const supertestServer = supertest(expressServer);

export default supertestServer;