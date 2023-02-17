const express = require("express");
const router = express.Router();
const refreshTokenController = require("../controllers/refreshToken.controller");

router.get("/", (req, res, next) => {
  res.status(200).json({
    code: 200,
    message: "Not allowed method",
  });
});

router.post("/", refreshTokenController.generate);

router.delete("/", refreshTokenController.delete);

module.exports = router;
