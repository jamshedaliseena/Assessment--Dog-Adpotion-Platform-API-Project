process.env.JWT_SECRET = 'test-secret';
const request = require('supertest'); const { MongoMemoryServer } = require('mongodb-memory-server'); const mongoose = require('mongoose'); const { expect } = require('chai'); const app = require('../app');
let mongo; let ownerToken; let adopterToken; let dogId;
const register = async (username) => (await request(app).post('/api/auth/register').send({ username, password: 'secret123' })).body.token;
before(async function () { this.timeout(30000); mongo = await MongoMemoryServer.create(); await mongoose.connect(mongo.getUri()); });
after(async () => { await mongoose.disconnect(); await mongo.stop(); });
describe('Dog Adoption API', () => {
  it('registers users and returns a token', async () => { ownerToken = await register('owner'); adopterToken = await register('adopter'); expect(ownerToken).to.be.a('string'); });
  it('creates an authenticated dog listing', async () => { const response = await request(app).post('/api/dogs').set('Authorization', `Bearer ${ownerToken}`).send({ name: 'Milo', description: 'A friendly beagle' }).expect(201); dogId = response.body.dog._id; expect(response.body.dog.name).to.equal('Milo'); });
  it('prevents an owner from adopting their own dog', async () => { await request(app).post(`/api/dogs/${dogId}/adopt`).set('Authorization', `Bearer ${ownerToken}`).send({ thankYouMessage: 'Thanks!' }).expect(403); });
  it('adopts a dog and prevents duplicate adoption', async () => { await request(app).post(`/api/dogs/${dogId}/adopt`).set('Authorization', `Bearer ${adopterToken}`).send({ thankYouMessage: 'Thank you for Milo!' }).expect(200); await request(app).post(`/api/dogs/${dogId}/adopt`).set('Authorization', `Bearer ${adopterToken}`).send({ thankYouMessage: 'Again' }).expect(409); });
  it('lists registered and adopted dogs with pagination metadata', async () => { const registered = await request(app).get('/api/dogs/registered?status=adopted&limit=1').set('Authorization', `Bearer ${ownerToken}`).expect(200); expect(registered.body.pagination.total).to.equal(1); const adopted = await request(app).get('/api/dogs/adopted?page=1&limit=1').set('Authorization', `Bearer ${adopterToken}`).expect(200); expect(adopted.body.dogs).to.have.length(1); });
});
