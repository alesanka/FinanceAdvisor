import express from 'express';
import bodyParser from 'body-parser';
import { initializeDatabase } from './db/initializeDb.js';
import { authentication } from './controllers/authentication.js';
import { token } from './controllers/token.js';
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

app.post('/api/v1/register', authentication.registerUser);
app.post('/api/v1/login', authentication.authenticateUser, token.getToken);

// EXAMPLE FOR CHECKING TOKEN
app.get('/api/v1/some_page', token.getAuthorization, (req, res) => {
  res.send('Protected resource');
});

app.post('/refresh', token.getToken);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
