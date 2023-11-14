import request from 'supertest';
import apiRoutes from '../src/routers.js';
import bodyParser from 'body-parser';
import express from 'express';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/api/v1/', (req, res) => {
  res.send("“It's alive! It's alive!” - Frankenstein, 1931");
});
app.use('/api/v1', apiRoutes);

let server;

beforeAll((done) => {
  server = app.listen(5000, done);
});

afterAll(() => {
  return new Promise((resolve) => {
    server.close(resolve);
  });
});

describe('Tests for checking correct statuses and responces ', () => {
  test('responds to /api/v1/', async () => {
    const response = await request(app).get('/api/v1/');
    expect(response.statusCode).toEqual(200);
    expect(response.text).toContain("It's alive!");
  });
});
