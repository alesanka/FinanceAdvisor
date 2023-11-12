import request from 'supertest';
import { app } from '../src/index.js';

describe('Tests for checking correct root status and responce ', () => {
  test('responds to /api/v1/', (done) => {
    request(app)
      .get('/api/v1/')
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.text).toContain("It's alive!");
        done();
      });
  });
});
