import db from './redisConfig.js';

class RedisRepository {
  async getClient(clientId) {
    try {
      const client = await db.hGetAll('clients:client', clientId);
      console.log(client);
      return client;
    } catch (error) {
      console.error(`Error fetching client: ${error.message}`);
      throw error;
    }
  }

  async getAccessToken(bearerToken) {
    try {
      const token = await db.hGetAll('tokens:accessToken', bearerToken);
      return token;
    } catch (error) {
      console.error(`Error fetching access token: ${error.message}`);
      throw error;
    }
  }

  async getRefreshToken(bearerToken) {
    try {
      const token = await db.hGetAll('tokens:refreshToken', bearerToken);
      return token;
    } catch (error) {
      console.error(`Error fetching refresh token: ${error.message}`);
      throw error;
    }
  }

  async saveRefreshToken(data) {
    try {
      await db.hSet('tokens:refreshToken', data);
    } catch (error) {
      console.error(`Error saving refresh token: ${error.message}`);
      throw error;
    }
  }

  async saveAccessToken(data) {
    try {
      await db.hSet('tokens:accessToken', data);
    } catch (error) {
      console.error(`Error saving access token: ${error.message}`);
      throw error;
    }
  }

  async deleteToken(token) {
    try {
      await db.del('tokens:refreshToken', token.refreshToken);
      await db.del('tokens:accessToken', token.accessToken);
    } catch (error) {
      console.error(`Error deleting tokens: ${error.message}`);
      throw error;
    }
  }
}

export const redisRepository = new RedisRepository();
