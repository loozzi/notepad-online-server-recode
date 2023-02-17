const userService = require("../services/user.service");

module.exports = {
  login: async (req, res, next) => {
    try {
      const { code, message, elements } = await userService.login({
        username: req.body.username,
        password: req.body.password,
      });

      res.json({
        code,
        message,
        elements,
      });
    } catch (err) {
      res.json({
        code: 500,
        message: "Internal Server Error",
      });
    }
  },
  register: async (req, res, next) => {
    try {
      const { code, message, elements } = await userService.register({
        username: req.body.username.trim(),
        password: req.body.password,
        email: req.body.email.trim(),
      });
      res.json({
        code,
        message,
        elements,
      });
    } catch (err) {
      res.json({
        code: 500,
        message: "Internal Server Error",
      });
    }
  },
  changePassword: async (req, res, next) => {
    try {
      const { code, message, elements } = await userService.changePassword({
        _id: res.data._id,
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
      });

      res.json({
        code,
        message,
        elements,
      });
    } catch (err) {
      res.json({
        code: 500,
        message: "Internal Server Error",
      });
    }
  },
  changeAvatar: async (req, res, next) => {
    try {
      const { code, message, elements } = await userService.changeAvatar({
        _id: res.data._id,
        newAvatar: req.body.newAvatar,
      });

      res.json({
        code,
        message,
        elements,
      });
    } catch (err) {
      return { code: 500, message: "Internal Server Error" };
    }
  },
  changeEmail: async (req, res, next) => {
    try {
      const { code, message, elements } = await userService.changeEmail({
        _id: res.data._id,
        newEmail: req.body.newEmail,
      });

      res.json({
        code,
        message,
        elements,
      });
    } catch (err) {
      return { code: 500, message: "Internal Server Error" };
    }
  },
  delete: async (req, res, next) => {
    const _id = req.params.id;
    const { code, message, elements } = await userService.delete({ _id });
    res.json({ code, message, elements });
  },
  getAll: async (req, res, next) => {
    try {
      const { limit, page } = req.query;
      const { code, message, elements } = await userService.getAll({
        limit,
        page,
      });

      res.json({ code, message, elements });
    } catch (err) {
      res.json({ code: 500, message: "Internal Server Error" });
    }
  },
  getOne: async (req, res, next) => {
    try {
      const username = req.params.username;
      const { code, message, elements } = await userService.getOne({
        username,
      });
      res.json({ code, message, elements });
    } catch (err) {
      res.json({ code: 500, message: "Internal Server Error" });
    }
  },
  me: async (req, res, next) => {
    try {
      const { code, message, elements } = await userService.me({
        _id: res.data._id,
      });
      res.json({ code, message, elements });
    } catch (err) {
      res.json({ code: 500, message: "Internal Server Error" });
    }
  },
};
