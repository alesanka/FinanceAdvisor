import db from '../db/redis/redisConfig.js';

class RedisRepository {
  async getClient(clientId) {
    try {
      const client = await db.hGetAll(`clients:client`);
      if (client.clientId === clientId) {
        return client;
      }
    } catch (error) {
      console.error(`Error fetching client: ${error.message}`);
      throw error;
    }
  }

  async getAccessToken(bearerToken) {
    try {
      const token = await db.hGetAll(`tokens:accessToken:${bearerToken}`);
      return token;
    } catch (error) {
      console.error(`Error fetching access token: ${error.message}`);
      throw error;
    }
  }

  async getRefreshToken(bearerToken) {
    try {
      const token = await db.hGetAll(`tokens:refreshToken:${bearerToken}`);
      return token;
    } catch (error) {
      console.error(`Error fetching refresh token: ${error.message}`);
      throw error;
    }
  }

  async saveAccessToken(data) {
    try {
      const {
        accessToken,
        accessTokenExpiresAt,
        client,
        refreshToken,
        refreshTokenExpiresAt,
        user,
      } = data;

      let accessTokenExpiresAtISO;
      if (accessTokenExpiresAt instanceof Date) {
        accessTokenExpiresAtISO = accessTokenExpiresAt.toISOString();
      } else {
        const date = new Date(accessTokenExpiresAt);
        if (!isNaN(date)) {
          accessTokenExpiresAtISO = date.toISOString();
        } else {
          console.error('accessTokenExpiresAt can not be Date');
        }
      }

      let refreshTokenExpiresAtISO;
      if (refreshTokenExpiresAt instanceof Date) {
        refreshTokenExpiresAtISO = refreshTokenExpiresAt.toISOString();
      } else {
        const date = new Date(refreshTokenExpiresAt);
        if (!isNaN(date)) {
          refreshTokenExpiresAtISO = date.toISOString();
        } else {
          console.error('refreshTokenExpiresAt can not be Date');
        }
      }

      await db.hSet(
        `tokens:accessToken:${accessToken}`,
        'accessToken',
        accessToken
      );
      await db.hSet(
        `tokens:accessToken:${accessToken}`,
        'accessTokenExpiresAt',
        accessTokenExpiresAtISO
      );
      await db.hSet(`tokens:accessToken:${accessToken}`, 'client', client);
      await db.hSet(`tokens:accessToken:${accessToken}`, 'user', user);

      await db.hSet(
        `tokens:refreshToken:${refreshToken}`,
        'refreshToken',
        refreshToken
      );
      await db.hSet(
        `tokens:refreshToken:${refreshToken}`,
        'refreshTokenExpiresAt',
        refreshTokenExpiresAtISO
      );
      await db.hSet(`tokens:refreshToken:${refreshToken}`, 'client', client);
      await db.hSet(`tokens:refreshToken:${refreshToken}`, 'user', user);
    } catch (error) {
      console.error(`Error saving access token: ${error.message}`);
      throw error;
    }
  }

  async saveRefreshToken(data) {
    try {
      const {
        accessToken,
        accessTokenExpiresAt,
        client,
        refreshToken,
        refreshTokenExpiresAt,
        user,
      } = data;

      let accessTokenExpiresAtISO;
      if (accessTokenExpiresAt instanceof Date) {
        accessTokenExpiresAtISO = accessTokenExpiresAt.toISOString();
      } else {
        const date = new Date(accessTokenExpiresAt);
        if (!isNaN(date)) {
          accessTokenExpiresAtISO = date.toISOString();
        } else {
          console.error('accessTokenExpiresAt can not be Date');
        }
      }

      let refreshTokenExpiresAtISO;
      if (refreshTokenExpiresAt instanceof Date) {
        refreshTokenExpiresAtISO = refreshTokenExpiresAt.toISOString();
      } else {
        const date = new Date(refreshTokenExpiresAt);
        if (!isNaN(date)) {
          refreshTokenExpiresAtISO = date.toISOString();
        } else {
          console.error('refreshTokenExpiresAt can not be Date');
        }
      }

      await db.hSet(
        `tokens:accessToken:${accessToken}`,
        'accessToken',
        accessToken
      );
      await db.hSet(
        `tokens:accessToken:${accessToken}`,
        'accessTokenExpiresAt',
        accessTokenExpiresAtISO
      );
      await db.hSet(`tokens:accessToken:${accessToken}`, 'client', client);
      await db.hSet(`tokens:accessToken:${accessToken}`, 'user', user);

      await db.hSet(
        `tokens:refreshToken:${refreshToken}`,
        'refreshToken',
        refreshToken
      );
      await db.hSet(
        `tokens:refreshToken:${refreshToken}`,
        'refreshTokenExpiresAt',
        refreshTokenExpiresAtISO
      );
      await db.hSet(`tokens:refreshToken:${refreshToken}`, 'client', client);
      await db.hSet(`tokens:refreshToken:${refreshToken}`, 'user', user);
    } catch (error) {
      console.error(`Error saving refresh token: ${error.message}`);
      throw error;
    }
  }

  async deleteToken(token) {
    console.log(token);
    try {
      await db.hDel(`tokens:refreshToken`, token.refreshToken);
      await db.hDel(`tokens:accessToken`, token.accessToken);
    } catch (error) {
      console.error(`Error deleting tokens: ${error.message}`);
      throw error;
    }
  }
}

export const redisRepository = new RedisRepository();
