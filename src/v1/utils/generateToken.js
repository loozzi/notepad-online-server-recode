const jwt = require("jsonwebtoken");
const _UserToken = require("../models/userToken.model");
const fs = require("fs");
const path = require("path");

const privateKey = fs.readFileSync(
  path.join(__dirname, "../configs/key/privateKey.pem")
);
const publicKey = fs.readFileSync(
  path.join(__dirname, "../configs/key/publicKey.crt")
);

const generateToken = async (user) => {
  // try {
  const payload = {
    _id: user._id,
    roles: user.roles,
  };

  const accessToken = jwt.sign(payload, privateKey, {
    expiresIn: "30m",
    algorithm: "RS256",
  });

  const refreshToken = jwt.sign(payload, privateKey, {
    expiresIn: "30d",
    algorithm: "RS256",
  });

  const userToken = await _UserToken.findOne({
    user_id: user._id,
  });
  if (userToken) {
    await userToken.remove();
  }

  await _UserToken.create({
    user_id: user._id,
    token: refreshToken,
  });

  return Promise.resolve({
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
  // } catch (err) {
  //   return Promise.reject(err);
  // }
};

module.exports = generateToken;
