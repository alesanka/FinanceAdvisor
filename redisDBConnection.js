const redis = require('redis');
const client = redis.createClient({
  host: 'localhost',
  port: 6379,
});

const connectDB = async () => {
  return new Promise((resolve, reject) => {
    client.on('connect', () => {
      console.log('Подключено к Redis');
      resolve(client);
    });

    client.on('error', (err) => {
      console.error(`Ошибка подключения к Redis: ${err}`);
      reject(err);
    });
  });
};

module.exports = connectDB;
