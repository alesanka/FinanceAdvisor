const express = require('express');
const bodyParser = require('body-parser');
const logInUser = require('./userRegistration');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userId = await logInUser(username, password);
    res.status(201).send({ success: true, userId });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
