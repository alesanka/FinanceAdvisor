import bcrypt from 'bcrypt';

const enabledScopes = ['read', 'write'];

export const createModel = (db, userPG) => {
  async function getClient(clientId, clientSecret) {
    try {
      return await db.findClient(clientId, clientSecret);
    } catch (error) {
      console.error('Error in getClient:', error);
      return false;
    }
  }

  async function getUser(username, password) {
    try {
      const existingUser = await userPG.findUserByUsername(username);
      if (!existingUser) {
        return false;
      }
      const validPassword = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!validPassword) {
        return false;
      }
      return existingUser;
    } catch (error) {
      console.error('Error in getUser:', error);
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

  async function saveToken(token, client, user) {
    try {
      const meta = {
        clientId: client.id,
        userId: user.id,
        scope: token.scope,
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

  async function getAccessToken(accessToken) {
    try {
      const meta = await db.findAccessToken(accessToken);
      if (!meta) {
        return false;
      }
      const userById = await userPG.findUserById(meta.userId);
      return {
        accessToken,
        accessTokenExpiresAt: meta.accessTokenExpiresAt,
        user: userById,
        client: await db.findClientById(meta.clientId),
        scope: meta.scope,
      };
    } catch (error) {
      console.error('Error in getAccessToken:', error);
      return false;
    }
  }

  async function getRefreshToken(refreshToken) {
    try {
      const meta = await db.findRefreshToken(refreshToken);
      if (!meta) {
        return false;
      }
      const userById = await userPG.findUserById(meta.userId);
      return {
        refreshToken,
        refreshTokenExpiresAt: meta.refreshTokenExpiresAt,
        user: userById,
        client: await db.findClientById(meta.clientId),
        scope: meta.scope,
      };
    } catch (error) {
      console.error('Error in getRefreshToken:', error);
      return false;
    }
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

  async function verifyScope(token, scope) {
    try {
      if (typeof scope === 'string') {
        return enabledScopes.includes(scope);
      } else {
        return scope.every((s) => enabledScopes.includes(s));
      }
    } catch (error) {
      console.error('Error in verifyScope:', error);
      return false;
    }
  }

  return {
    getClient,
    getUser,
    saveToken,
    getAccessToken,
    getRefreshToken,
    revokeToken,
    validateScope,
    verifyScope,
  };
};
