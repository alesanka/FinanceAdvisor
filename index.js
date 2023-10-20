const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.send("My project and I'll finish it!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
