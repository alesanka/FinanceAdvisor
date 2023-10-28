import express from 'express';
import bodyParser from 'body-parser';
import { initializeDatabase } from './db/initializeDb.js';
import { authentication } from './controllers/authentication.js';
import { token } from './controllers/token.js';
import * as dotenv from 'dotenv';

dotenv.config();
initializeDatabase();

const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.post('/token', token.getToken);

app.get('/', (req, res) => {
  res.send("“It's alive! It's alive!” - Frankenstein, 1931");
});

app.post('/register', authentication.registerUser);
app.post('/login', authentication.authenticateUser, token.getToken);

// in development
app.get('/some_page', token.getAuthorization, (req, res) => {
  res.send('Protected resource');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
