import NodeOAuthServer from '@node-oauth/oauth2-server';
import { Request, Response } from '@node-oauth/oauth2-server';
import InvalidArgumentError from '@node-oauth/oauth2-server/lib/errors/invalid-argument-error';
import UnauthorizedRequestError from '@node-oauth/oauth2-server/lib/errors/unauthorized-request-error';

class OAuthServer {
  constructor(options) {
    this.options = options || {};

    if (!this.options.model) {
      throw new InvalidArgumentError('Missing parameter: `model`');
    }

    this.useErrorHandler = this.options.useErrorHandler === true;
    this.continueMiddleware = this.options.continueMiddleware === true;

    delete this.options.useErrorHandler;
    delete this.options.continueMiddleware;

    this.server = new NodeOAuthServer(this.options);
  }

  // Returns a middleware that will validate a token.
  authenticate(options) {
    return async (req, res, next) => {
      const request = new Request(req);
      const response = new Response(res);
      let token;
      try {
        token = await this.server.authenticate(request, response, options);
      } catch (err) {
        this._handleError(res, null, err, next);
        return;
      }
      res.locals.oauth = { token };
      return next();
    };
  }

  // Returns a middleware that will authorize a client to request tokens.
  authorize(options) {
    return async (req, res, next) => {
      const request = new Request(req);
      const response = new Response(res);
      let code;
      try {
        code = await this.server.authorize(request, response, options);
      } catch (err) {
        this._handleError(res, response, err, next);
        return;
      }
      res.locals.oauth = { code };
      if (this.continueMiddleware) {
        next();
      }
      return this._handleResponse(req, res, response);
    };
  }

  // Returns a middleware that will authorize a client to request tokens.
  token(options) {
    return async (req, res, next) => {
      const request = new Request(req);
      const response = new Response(res);
      let token;
      try {
        token = await this.server.token(request, response, options);
      } catch (err) {
        this._handleError(res, response, err, next);
        return;
      }
      res.locals.oauth = { token };
      if (this.continueMiddleware) {
        next();
      }
      return this._handleResponse(req, res, response);
    };
  }

  // Returns middleware that will grant tokens to valid requests.
  _handleResponse(req, res, oauthResponse) {
    if (oauthResponse.status === 302) {
      const location = oauthResponse.headers.location;
      delete oauthResponse.headers.location;
      res.set(oauthResponse.headers);
      res.redirect(location);
      return;
    }
    res.set(oauthResponse.headers);
    res.status(oauthResponse.status).send(oauthResponse.body);
  }

  /** Handles errors depending on the options of `this.useErrorHandler`.
    Either calls `next()` with the error (so the application can handle it), or returns immediately a response with the error.*/
  _handleError(res, oauthResponse, error, next) {
    if (this.useErrorHandler) {
      return next(error);
    }

    if (oauthResponse) {
      res.set(oauthResponse.headers);
    }

    res.status(error.code || 500);

    if (error instanceof UnauthorizedRequestError) {
      return res.send();
    }

    return res.send({ error: error.name, error_description: error.message });
  }
}

export default OAuthServer;
