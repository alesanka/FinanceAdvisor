import db from './redisConfig.js';

export class RedisRepository {
  constructor(connection) {
    this.connection = connection;
  }
  async getClient(clientId) {
    try {
      const client = await this.connection.hGetAll('clients:client', clientId);

      return client;
    } catch (error) {
      console.error(`Error fetching client: ${error.message}`);
      throw error;
    }
  }

  async getAccessToken(bearerToken) {
    try {
      const token = await this.connection.hGetAll(
        'tokens:accessToken',
        bearerToken
      );

      return token;
    } catch (error) {
      console.error(`Error fetching access token: ${error.message}`);
      throw error;
    }
  }

  async getRefreshToken(bearerToken) {
    try {
      const token = await this.connection.hGetAll(
        'tokens:refreshToken',
        bearerToken
      );

      return token;
    } catch (error) {
      console.error(`Error fetching refresh token: ${error.message}`);
      throw error;
    }
  }

  async saveRefreshToken(data) {
    try {
      await this.connection.hSet('tokens:refreshToken', data);
    } catch (error) {
      console.error(`Error saving refresh token: ${error.message}`);
      throw error;
    }
  }

  async saveAccessToken(data) {
    try {
      await this.connection.hSet('tokens:accessToken', data);
    } catch (error) {
      console.error(`Error saving access token: ${error.message}`);
      throw error;
    }
  }

  async deleteToken(token) {
    try {
      await this.connection.del('tokens:refreshToken', token.refreshToken);
      await this.connection.del('tokens:accessToken', token.accessToken);
    } catch (error) {
      console.error(`Error deleting tokens: ${error.message}`);
      throw error;
    }
  }
}

export const redisRepository = new RedisRepository(db);
