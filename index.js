import express from 'express';
import bodyParser from 'body-parser';
import { initializeDatabase } from './db/initializeDb.js';
import {
  authenticationController,
  userController,
} from './controllers/userController.js';
import { token } from './controllers/tokenController.js';
import * as dotenv from 'dotenv';

dotenv.config();
initializeDatabase();

const PORT = process.env.APP_PORT;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/v1/', (req, res) => {
  res.send("“It's alive! It's alive!” - Frankenstein, 1931");
});

app.post('/api/v1/register', authenticationController.registerUser);
app.post(
  '/api/v1/login',
  authenticationController.authenticateUser,
  token.getToken
);
app.post('/api/v1/refresh_token', token.getToken);

app.get('/api/v1/users', token.getAuthorization, userController.getAllUsers);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
