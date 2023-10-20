const { pool } = require('./dbConfig');

const logInUser = async (login, password) => {
  try {
    const result = await pool.query(
      'INSERT INTO users (login, password) VALUES ($1, $2) RETURNING id',
      [login, password]
    );
    return result.rows[0].id;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = logInUser;
