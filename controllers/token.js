import * as dotenv from 'dotenv';
import { db } from '../db/client.js';
import { createModel } from '../services/tokenModel.js';
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
        res.json(token);
        console.log('Authorization token successfully retrieved!');
      })
      .catch((err) => {
        console.error(err);
        res.status(400).json({ error: err.message });
      });
  };
  getAuthorization = async (req, res, next) => {
    const request = new Request({
      method: req.method,
      headers: req.headers,
      query: {},
      body: req.body,
    });
    const response = new Response(res);

    oauth
      .authenticate(request, response)
      .then(function (token) {
        res.locals.oauth = { token: token };
        console.log('Authorization passed!');
        next();
      })
      .catch((err) => {
        console.error(err);
        res.status(400).json({ error: err.message });
      });
  };
}

export const token = new Token();
