const pool = require("../config/db");

const createRefreshToken = async ({
  client,
  userId,
  tokenHash,
  expiresAt,
}) => {
  const result = await client.query(
    `
        INSERT INTO refresh_tokens (
            user_id,
            token_hash,
            expires_at
        )
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
    [userId, tokenHash, expiresAt]
  );

  return result.rows[0];
};

const getRefreshToken = async ({
  client,
  userId,
  tokenHash,
}) => {
  const result = await client.query(
    `
        SELECT *
        FROM refresh_tokens
        WHERE user_id = $1
        AND token_hash = $2
        `,
    [userId, tokenHash]
  );

  return result.rows[0];
};

const deleteRefreshToken = async ({
  client,
  tokenHash,
}) => {
  await client.query(
    `
        DELETE FROM refresh_tokens
        WHERE token_hash = $1
        `,
    [tokenHash]
  );
};

const deleteRefreshTokenByUserId = async ({
  client,
  userId,
  tokenHash,
}) => {
  await client.query(
    `
        DELETE FROM refresh_tokens
        WHERE user_id = $1
        AND token_hash = $2
        `,
    [userId, tokenHash]
  );
};

const deleteRefreshTokenByHash = async ({
  client,
  tokenHash,
}) => {
  await client.query(
    `
        DELETE FROM refresh_tokens
        WHERE token_hash = $1
        `,
    [tokenHash]
  );
};


module.exports = {
  createRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
  deleteRefreshTokenByHash,
  deleteRefreshTokenByUserId
};