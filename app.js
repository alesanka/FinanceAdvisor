import express from 'express';
import bodyParser from 'body-parser';
import Authorization from './authentification/authorization';

const app = express();
const PORT = 5000;
const authorization = new Authorization();

app.use(bodyParser.json());

app.post('/register', authorization.registerUser());
app.post('/login', authorization.loginUser());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
