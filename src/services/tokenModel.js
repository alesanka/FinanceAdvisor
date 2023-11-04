import { pool } from '../../db/postgress/dbPool.js';

const enabledScopes = ['admin', 'worker'];

export const createModel = (db) => {
  async function getClient(clientId, clientSecret) {
    try {
      return await db.findClient(clientId, clientSecret);
    } catch (error) {
      console.error('Error in getClient:', error);
      return false;
    }
  }

  async function validateScope(user, client, scope) {
    try {
      if (!user || !client || !db.findClientById(client.id)) {
        return false;
      }
      if (typeof scope === 'string') {
        return enabledScopes.includes(scope);
      } else {
        return scope.every((s) => enabledScopes.includes(s));
      }
    } catch (error) {
      console.error('Error in validateScope:', error);
      return false;
    }
  }

  async function getAccessToken(accessToken) {
    const meta = db.findAccessToken(accessToken);
    if (!meta) {
      return false;
    }

    return {
      accessToken,
      accessTokenExpiresAt: meta.accessTokenExpiresAt,
      user: meta.user_id,
      client: db.findClientById(meta.clientId),
      scope: meta.scope,
    };
  }

  async function getRefreshToken(refreshToken) {
    const meta = db.findRefreshToken(refreshToken);

    if (!meta) {
      return false;
    }

    return {
      refreshToken,
      refreshTokenExpiresAt: meta.refreshTokenExpiresAt,
      user: meta.user_id,
      client: db.findClientById(meta.clientId),
      scope: meta.scope,
    };
  }

  async function saveToken(token, client, user) {
    try {
      const meta = {
        clientId: client.id,
        user_id: user.user_id,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      };

      token.client = client;
      token.user = user;

      if (token.accessToken) {
        await db.saveAccessToken(token.accessToken, meta);
      }

      if (token.refreshToken) {
        await db.saveRefreshToken(token.refreshToken, meta);
      }

      return token;
    } catch (error) {
      console.error('Error in saveToken:', error);
      return false;
    }
  }

  async function getUser(username, password) {
    const result = await pool.query(
      'SELECT user_id, username, password FROM users WHERE username = $1;',
      [username]
    );
    return {
      user_id: result.rows[0].user_id,
      username: result.rows[0].username,
    };
  }

  async function revokeToken(token) {
    try {
      await db.deleteRefreshToken(token.refreshToken);
      return true;
    } catch (error) {
      console.error('Error in revokeToken:', error);
      return false;
    }
  }

  // async function verifyScope(token, scope) {
  //   try {
  //     if (typeof scope === 'string') {
  //       return enabledScopes.includes(scope);
  //     } else {
  //       return scope.every((s) => enabledScopes.includes(s));
  //     }
  //   } catch (error) {
  //     console.error('Error in verifyScope:', error);
  //     return false;
  //   }
  // }

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