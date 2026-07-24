const pool = require("../config/db");

const getUserByEmail = async ({ client, email }) => {
  const result = await client.query(
    `
        SELECT *
        FROM users
        WHERE email = $1
        `,
    [email]
  );

  return result.rows[0];
};

const createUser = async ({ client, name, email, password }) => {
  const result = await client.query(
    `
        INSERT INTO users(name, email, password)
        VALUES($1, $2, $3)
        RETURNING id, name, email, created_at
        `,
    [name, email, password]
  );

  return result.rows[0];
};

const getUserById = async ({ client, userId }) => {
  const result = await client.query(
    `
        SELECT
            id,
            name,
            email
        FROM users
        WHERE id = $1
        `,
    [userId]
  );

  return result.rows[0];
};

module.exports = {
  getUserByEmail,
  createUser,
  getUserById
};