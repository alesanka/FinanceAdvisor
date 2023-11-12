import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import apiRoutes from '../src/routers.js';

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

afterAll((done) => {
  server.close(done);
});

describe('Tests for checking correct statuses and responces ', () => {
  it('responds to /api/v1/', async () => {
    const response = await request(app).get('/api/v1/');
    expect(response.statusCode).toEqual(200);
    expect(response.text).toContain("It's alive!");
  });
});
