import * as dotenv from 'dotenv';
import { db } from '../db/client.js';
import { createModel } from '../blueprints/tokenModel.js';
import pkg from '@node-oauth/oauth2-server';
import OAuthServer from '@node-oauth/oauth2-server';
const { Request, Response } = pkg;
dotenv.config();

const model = createModel(db);

const oauth = new OAuthServer({
  model: model,
});

let options = {
  alwaysIssueNewRefreshToken: true,
};

class Token {
  /*
 const stringBody =
    'client_id=this-client-id-is-for-demo-only&client_secret=this-secret-id-is-for-demo-only&grant_type=password&scope=user&username=daniil&password=abrakadabra';

   { !!!
      method: 'POST',
      query: {},
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: {
        grant_type: password,
        scope: user|admin|worker,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        username: username,
        password: password,
      },
    };
  */
  getToken = async (req, res) => {
    const request = new Request({
      method: req.method,
      query: {},
      headers: req.headers,
      body: req.body,
    });

    const response = new Response(res);

    oauth
      .token(request, response, options)
      .then((token) => {
        // res.json(token);
        console.log('Authorization token successfully retrieved!');
        res.status(200).send('User came with peace and token!');
        return token;
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });
  };
}

export const token = new Token();
