const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const pool = require("../config/db");

const userModel = require("../models/user.model");
const refreshTokenModel = require("../models/refreshToken.model");

const registerUser = async ({ name, email, password }) => {
  const client = await pool.connect();

  try {
    email = email.trim().toLowerCase();

    const existingUser = await userModel.getUserByEmail({
      client,
      email,
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.createUser({
      client,
      name,
      email,
      password: hashedPassword,
    });

    return user;
  } finally {
    client.release();
  }
};

const loginUser = async ({ email, password }) => {
  const client = await pool.connect();

  try {
    email = email.trim().toLowerCase();

    const user = await userModel.getUserByEmail({
      client,
      email,
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new Error("Invalid email or password");
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
      }
    );

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const decodedRefreshToken = jwt.decode(refreshToken);

    const expiresAt = new Date(decodedRefreshToken.exp * 1000);

    await refreshTokenModel.createRefreshToken({
      client,
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  } finally {
    client.release();
  }
};

const getCurrentUser = async ({ userId }) => {
  const client = await pool.connect();

  try {
    const user = await userModel.getUserById({
      client,
      userId,
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } finally {
    client.release();
  }
};

const refreshAccessToken = async ({ refreshToken }) => {
  const client = await pool.connect();

  try {
    let decodedRefreshToken;

    try {
      decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const storedRefreshToken =
      await refreshTokenModel.getRefreshToken({
        client,
        userId: decodedRefreshToken.id,
        tokenHash: refreshTokenHash,
      });

    if (!storedRefreshToken) {
      throw new Error("Refresh token has been revoked");
    }

    await refreshTokenModel.deleteRefreshTokenByUserId({
      client,
      userId: decodedRefreshToken.id,
      tokenHash: refreshTokenHash,
    });

    const newAccessToken = jwt.sign(
      {
        id: decodedRefreshToken.id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      }
    );

    const newRefreshToken = jwt.sign(
      {
        id: decodedRefreshToken.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
      }
    );

    const newRefreshTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    const decodedNewRefreshToken = jwt.decode(newRefreshToken);

    const expiresAt = new Date(decodedNewRefreshToken.exp * 1000);

    await refreshTokenModel.createRefreshToken({
      client,
      userId: decodedRefreshToken.id,
      tokenHash: newRefreshTokenHash,
      expiresAt,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } finally {
    client.release();
  }
};

const logoutUser = async ({ refreshToken }) => {
  const client = await pool.connect();

  try {
    if (!refreshToken) {
      return;
    }

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await refreshTokenModel.deleteRefreshTokenByHash({
      client,
      tokenHash: refreshTokenHash,
    });
  } finally {
    client.release();
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshAccessToken,
  logoutUser
};