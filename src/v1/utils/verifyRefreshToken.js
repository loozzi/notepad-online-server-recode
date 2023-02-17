const _UserToken = require("../models/userToken.model");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const publicKey = fs.readFileSync(
  path.join(__dirname, "../configs/key/publicKey.crt")
);
const privateKey = fs.readFileSync(
  path.join(__dirname, "../configs/key/privateKey.pem")
);

const verifyRefreshToken = async ({ refreshToken }) => {
  try {
    const userToken = await _UserToken.findOne({ token: refreshToken });
    if (!!userToken) {
      const tokenDetails = jwt.verify(refreshToken, publicKey, {
        algorithms: ["RS256"],
      });

      return {
        tokenDetails,
        error: false,
        message: "Valid refresh token",
      };
    } else {
      return {
        error: true,
        message: "Invalid refresh token",
      };
    }
  } catch (error) {
    return {
      error: true,
      message: "Invalid refresh token",
    };
  }
};

module.exports = verifyRefreshToken;
