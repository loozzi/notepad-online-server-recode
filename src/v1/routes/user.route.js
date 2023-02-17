const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const middleware = require("../utils/middleware");

router.get("/", (req, res, next) => {
  res.json({
    code: 200,
    message: "Not allowed method",
  });
});

router.post("/login", userController.login);

router.post("/register", userController.register);

router.put("/password", middleware.isLogging, userController.changePassword);

router.put("/avatar", middleware.isLogging, userController.changeAvatar);

router.put("/email", middleware.isLogging, userController.changeEmail);

router.delete(
  "/:id",
  middleware.isLogging,
  middleware.isAdmin,
  userController.delete
);

router.get(
  "/all",
  middleware.isLogging,
  middleware.isAdmin,
  userController.getAll
);

router.get("/me", middleware.isLogging, userController.me);

router.get("/:username", userController.getOne);

module.exports = router;
