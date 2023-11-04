import { userRepos } from '../src/repositories/userRepos.js';
import { redisRepository } from './redisRepository.js';

const enabledScopes = ['admin', 'worker'];

export async function getClient(clientId, clientSecret) {
  try {
    const clientData = await redisRepository.getClient(clientId);

    if (!clientData || clientData.clientSecret !== clientSecret) {
      return null;
    }

    clientData.grants = JSON.parse(clientData.grants);
    const client = {
      clientId: clientData.clientId,
      clientSecret: clientData.clientSecret,
      grants: clientData.grants,
    };

    return client;
  } catch (error) {
    console.error('Error fetching client:', error);
    throw new Error('Error retrieving client data');
  }
}

export async function validateScope(user, client, scope) {
  if (!user || !client) {
    return false;
  }
  try {
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

export async function getAccessToken(bearerToken) {
  try {
    const token = await redisRepository.getAccessToken(bearerToken);
    if (!token) {
      return null;
    }

    return {
      accessToken: token.accessToken,
      client: token.client,
      accessTokenExpiresAt: new Date(token.accessTokenExpiresOn),
      user: token.user,
    };
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Error retrieving access token');
  }
}

export async function getRefreshToken(bearerToken) {
  try {
    const token = await redisRepository.getRefreshToken(bearerToken);
    if (!token) {
      return null;
    }

    return {
      accessToken: token.accessToken,
      client: token.client,
      accessTokenExpiresAt: new Date(token.refreshTokenExpiresOn),
      refreshToken: token.refreshToken,
      user: token.user,
      refreshTokenExpiresAt: new Date(token.refreshTokenExpiresAt),
    };
  } catch (error) {
    console.error('Error getting refresh token:', error);
    throw new Error('Error retrieving refresh token');
  }
}

export async function saveToken(token, client, user) {
  let saveUser = user;
  if (typeof saveUser === 'string') {
    saveUser = { id: user };
  }

  const data = {
    client: client.clientId,
    user: saveUser.id,
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt.toISOString(),
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt.toISOString(),
  };
  try {
    if (token.accessToken) {
      await redisRepository.saveAccessToken(data);
    }

    if (token.refreshToken) {
      await redisRepository.saveRefreshToken(data);
    }

    token.client = client;
    token.user = user;

    return token;
  } catch (error) {
    console.error('Error saving token:', error);
    throw new Error('Error saving token');
  }
}

export async function getUser(username) {
  try {
    const user = await userRepos.findUserByUsername(username);
    if (!user) {
      throw new Error('Can not find user');
    }

    return {
      id: user.user_id,
      username: user.username,
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Error retrieving user');
  }
}

export async function revokeToken(token) {
  try {
    await redisRepository.deleteToken(token);
    return true;
  } catch (error) {
    console.error('Error revoking token:', error);
    throw new Error('Error revoking token');
  }
}
