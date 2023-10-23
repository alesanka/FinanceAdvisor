import bluebird from 'bluebird';
import redis from 'redis';
import { format } from 'util';

const db = bluebird.promisify(redis.createClient());

const formats = {
  client: 'clients:%s',
  token: 'tokens:%s',
  user: 'users:%s',
};

export function getAccessToken(bearerToken) {
  return db.hgetall(format(formats.token, bearerToken)).then((token) => {
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
}

export function getClient(clientId, clientSecret) {
  return db.hgetall(format(formats.client, clientId)).then((client) => {
    if (!client || client.clientSecret !== clientSecret) {
      return;
    }

    return {
      clientId: client.clientId,
      clientSecret: client.clientSecret,
    };
  });
}

export function getRefreshToken(bearerToken) {
  return db.hgetall(format(formats.token, bearerToken)).then((token) => {
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
}

export function getUser(username, password) {
  return db.hgetall(format(formats.user, username)).then((user) => {
    if (!user || password !== user.password) {
      return;
    }

    return {
      id: username,
    };
  });
}

export function saveToken(token, client, user) {
  var data = {
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    clientId: client.id,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    userId: user.id,
  };

  return Promise.all([
    db.hmset(format(formats.token, token.accessToken), data),
    db.hmset(format(formats.token, token.refreshToken), data),
  ]).then(() => data);
}
