const express = require('express');
const connectDB = require('./redisDBConnection');

const app = express();
const PORT = 5000;

connectDB();
const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
);
// Handling Error
process.on('unhandledRejection', (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});
