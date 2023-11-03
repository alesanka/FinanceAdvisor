import { pool } from '../db/dbPool.js';
import { promisify } from 'bluebird';
import { createClient } from 'redis';
import { format } from 'util';

const db = promisify(createClient());

// const enabledScopes = ['admin', 'worker'];

export const createRepos = (db) => {
  async function getClient(clientId, clientSecret) {}

  async function validateScope(user, client, scope) {}

  async function getAccessToken(accessToken) {}

  async function getRefreshToken(refreshToken) {}

  async function saveToken(token, client, user) {}

  async function getUser(username, password) {}

  async function revokeToken(token) {}

  return {
    getClient,
    saveToken,
    revokeToken,
    validateScope,
    getUser,
    getAccessToken,
    getRefreshToken,
  };
};

var formats = {
  client: 'clients:%s',
  token: 'tokens:%s',
  user: 'users:%s',
};

/**
 * Get access token.
 */

module.exports.getAccessToken = function (bearerToken) {
  return db.hgetall(fmt(formats.token, bearerToken)).then(function (token) {
    if (!token) {
      return;
    }

    return {
      accessToken: token.accessToken,
      clientId: token.clientId,
      expires: token.accessTokenExpiresOn,
      userId: token.userId,
    };
  });
};

/**
 * Get client.
 */

module.exports.getClient = function (clientId, clientSecret) {
  return db.hgetall(fmt(formats.client, clientId)).then(function (client) {
    if (!client || client.clientSecret !== clientSecret) {
      return;
    }

    return {
      clientId: client.clientId,
      clientSecret: client.clientSecret,
    };
  });
};

/**
 * Get refresh token.
 */

module.exports.getRefreshToken = function (bearerToken) {
  return db.hgetall(fmt(formats.token, bearerToken)).then(function (token) {
    if (!token) {
      return;
    }

    return {
      clientId: token.clientId,
      expires: token.refreshTokenExpiresOn,
      refreshToken: token.accessToken,
      userId: token.userId,
    };
  });
};

/**
 * Get user.
 */

module.exports.getUser = function (username, password) {
  return db.hgetall(fmt(formats.user, username)).then(function (user) {
    if (!user || password !== user.password) {
      return;
    }

    return {
      id: username,
    };
  });
};

/**
 * Save token.
 */

module.exports.saveToken = function (token, client, user) {
  var data = {
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    clientId: client.id,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    userId: user.id,
  };

  return Promise.all([
    db.hmset(fmt(formats.token, token.accessToken), data),
    db.hmset(fmt(formats.token, token.refreshToken), data),
  ]).return(data);
};
