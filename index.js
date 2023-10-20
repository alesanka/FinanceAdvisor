const express = require('express');
const bodyParser = require('body-parser');
const logInUser = require('./authentification/userRegistration');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (password.length < 8) {
      return res.status(400).send({
        success: false,
        message: 'Password should be at least 8 characters long',
      });
    }

    const userId = await logInUser(username, password);
    res.status(201).send({
      success: true,
      message: 'User registration is successful.',
      userId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
