const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const publicKey = fs.readFileSync(
  path.join(__dirname, "../configs/key/publicKey.crt")
);

module.exports = {
  isLogging: async (req, res, next) => {
    try {
      const accessToken = req.cookies.accessToken;
      const data = await jwt.verify(accessToken, publicKey, {
        algorithms: ["RS256"],
      });
      res.data = data;
      next();
    } catch (e) {
      res.json({
        code: 400,
        message: "Token is expired",
      });
    }
  },
  isAdmin: async (req, res, next) => {
    if (res.data.roles.includes("admin")) next();
    else
      res.json({
        code: 423,
        message: "Not have permission",
      });
  },
  isRoot: async (req, res, next) => {
    if (res.data.roles.includes("root")) next();
    else
      res.json({
        code: 423,
        message: "Not have permission",
      });
  },
};
