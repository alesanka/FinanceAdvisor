const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Хранилище для зарегистрированных приложений
const registeredApps = {};

// Эндпоинт для регистрации приложения
app.post('/register', (req, res) => {
  const { appName, redirectUri } = req.body;
  if (!appName || !redirectUri) {
    return res.status(400).json({
      error: 'Необходимо указать название приложения и URL перенаправления',
    });
  }

  // Генерируем уникальный Client ID и Client Secret
  const clientId = generateClientId();
  const clientSecret = generateClientSecret();

  // Сохраняем информацию о приложении
  registeredApps[clientId] = {
    appName,
    redirectUri,
    clientSecret,
  };

  // Возвращаем разработчику Client ID и Client Secret
  res.json({ clientId, clientSecret });
});

// Генерация уникального Client ID
function generateClientId() {
  return 'your_unique_client_id';
}

// Генерация уникального Client Secret
function generateClientSecret() {
  return 'your_unique_client_secret';
}

// Запуск сервера
app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});
