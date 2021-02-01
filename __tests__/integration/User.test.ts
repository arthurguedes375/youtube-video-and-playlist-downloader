import faker from 'faker';

import supertest from './supertest';

describe('User Integration', () => {
    it('should return a random name', async () => {
        const { body } = await supertest.get("/");
        const name = faker.name.firstName();
        expect(body.message).toBe(process.env.HTTP_PORT);
    });
});