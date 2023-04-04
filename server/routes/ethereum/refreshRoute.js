const express = require("express");
require("dotenv").config();
const JWT = require("jsonwebtoken");

const refreshRoute = express();

refreshRoute.get("/", async (req, res) => {
  try {
    const { refreshJWT: refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).json({ message: "No token found", authenticated: false });
    }

    const data = JWT.verify(refreshToken, process.env.JWT_REFRESH_PRIVATE_KEY);

    const { address, passType, expiration } = data;

    if (!address) return res.status(400).json({ message: "Invalid authentication", authenticated: false });

    const newAccessToken = JWT.sign(
      {
        address,
        passType,
        expiration,
      },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: 200,
      }
    );

    res.status(200).json({ message: "Token updated", token: newAccessToken, refreshToken, authenticated: true });
  } catch (err) {
    res.status(400).json({ message: "Invalid authentication", authenticated: false });
  }
});

module.exports = refreshRoute;
