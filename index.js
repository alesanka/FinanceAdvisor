import express from 'express';
import bodyParser from 'body-parser';
import { initializeDatabase } from './db/initializeDb.js';
import * as dotenv from 'dotenv';
import userRouter from './routers/userRouter.js';
import registerRouter from './routers/registrationRouter.js';
import authRouter from './routers/authRouter.js';

dotenv.config();
initializeDatabase();

const PORT = process.env.APP_PORT;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/v1/', (req, res) => {
  res.send("“It's alive! It's alive!” - Frankenstein, 1931");
});

app.use('/api/v1/register', registerRouter);
app.use('/api/v1/login', authRouter);
app.use('/api/v1/users', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
