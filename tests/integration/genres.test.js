
let server;
const request = require('supertest');
describe('/api/genres', () => {
    beforeEach(() => {
        server = require('../../app');
    })
    afterEach(()=>{
        server.close();
    });
    describe('GET /', () => {
        it('returns all genres', async () => {
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
        });
    })
});