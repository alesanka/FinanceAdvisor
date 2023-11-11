import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import apiRoutes from '../src/routers.js';

// jest.mock('../db/redis/client', () => ({
//   initializeRedis: jest.fn().mockResolvedValue({}),
// }));
// jest.mock('../db/redis/redisConfig.js', () => ({
//   db: jest.fn().mockResolvedValue({}),
// }));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/api/v1/', (req, res) => {
  res.send("“It's alive! It's alive!” - Frankenstein, 1931");
});
app.use('/api/v1', apiRoutes);

describe('first test for common GET ', () => {
  it('responds to /api/v1/', async () => {
    const response = await request(app).get('/api/v1/');
    expect(response.statusCode).toEqual(200);
    expect(response.text).toContain("It's alive!");
  });
});
