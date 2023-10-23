import express from 'express';
import bodyParser from 'body-parser';
import Authorization from './authorisation/authorization';
import oauthServer from '@node-oauth/oauth2-server';
import model from './authorisation/model';

const app = express();
const PORT = 5000;

const authorization = new Authorization();

app.oauth = oauthServer({
  model: model,
});

app.use(bodyParser.json());

app.post('/oauth/token', app.oauth.token());
app.get('/secret', app.oauth.authorize(), function (req, res) {
  res.send('Secret area');
});
app.post('/register', authorization.registerUser);
app.post('/login', authorization.loginUser);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
