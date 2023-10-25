import express from 'express';
import bodyParser from 'body-parser';
import OAuthServer from '@node-oauth/oauth2-server';
import {
  model,
  authentication,
} from './controllers/authenticationController.js';
import * as dotenv from 'dotenv';
dotenv.config();

const PORT = 5000;
const app = express();

app.oauth = new OAuthServer({
  model: model,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/token', oauth.token());

app.get('/', (req, res) => {
  res.send('My God is in control!');
});

app.post('/register', authentication.registerUser);
// app.get('/register');
// app.post(
//   '/login',
//   authentication.authenticateUser,
//   app.oauth.token((req, res) => {
//     const request = new Request(req);
//     const response = new Response(res);

//     app.oauth
//       .token(request, response)
//       .then((token) => {
//         res.json(token);
//       })
//       .catch((err) => {
//         res.status(err.code || 500).json(err);
//       });
//   })
// );

// in development
// app.get('/protected_resource', app.oauth.authenticate(), (req, res) => {
//   res.send('Protected resource');
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
