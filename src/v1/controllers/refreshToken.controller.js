const verifyRefreshToken = require("../utils/verifyRefreshToken");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const _UsetToken = require("../models/userToken.model");

const privateKey = fs.readFileSync(
  path.join(__dirname, "../configs/key/privateKey.pem")
);

module.exports = {
  generate: async (req, res, next) => {
    const { error, tokenDetails, message } = await verifyRefreshToken({
      refreshToken: req.query.refreshToken,
    });

    if (!error) {
      const payload = {
        _id: tokenDetails._id,
        roles: tokenDetails.roles,
      };

      const accessToken = jwt.sign(payload, privateKey, {
        expiresIn: "30m",
        algorithm: "RS256",
      });

      res.status(200).json({
        code: 200,
        elements: {
          accessToken: accessToken,
        },
        message: "Access token created successfully",
      });
    } else {
      res.json({
        code: 401,
        message: message,
        refreshToken: req.query.refreshToken,
      });
    }
  },
  delete: async (req, res, next) => {
    try {
      const userToken = await _UsetToken.findOne({
        token: req.query.refreshToken,
      });

      if (userToken) {
        userToken.remove();
      }

      res.status(200).json({
        code: 200,
        message: "Logout successfully",
      });
    } catch (err) {
      res.status(500).json({
        code: 500,
        message: "Internal Server Error",
      });
    }
  },
};
