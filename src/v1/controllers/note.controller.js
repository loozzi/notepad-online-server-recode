const md5 = require("md5");
const random = require("../utils/random");
const noteService = require("../services/note.service");

module.exports = {
  create: async (req, res, next) => {
    try {
      let password = req.body.password.trim();
      let permalink = random.permalink(10);

      const { code, message, elements } = await noteService.create({
        ...req.body,
        password: password,
        permalink: permalink,
        tags: req.body.tags,
        create_at: Date.now(),
        _id: res.data._id,
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
  delete: async (req, res, next) => {
    try {
      const { permalink, password } = req.query;

      const { code, message, elements } = await noteService.delete({
        permalink,
        password,
        roles: res.data.roles,
        _id: res.data._id,
      });

      res.json({ code, message, elements });
    } catch (err) {
      res.json({
        code: 500,
        message: "Internal Server Error",
      });
    }
  },
  edit: async (req, res, next) => {
    try {
      const { code, message, elements } = await noteService.edit({
        ...req.body,
        _id: res.data._id,
      });

      res.json({ code, message, elements });
    } catch (err) {
      res.json({
        code: 500,
        message: "Internal Server Error",
      });
    }
  },
  get: async (req, res, next) => {
    try {
      const { code, message, elements } = await noteService.get({
        permalink: req.query.permalink,
        password: req.query.password,
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
  getAll: async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const { code, message, elements } = await noteService.getAll({
        _id: res.data._id,
        page,
        limit,
      });
      res.json({ code, message, elements });
    } catch (err) {
      res.json({ code: 500, message: "Internal Server Error" });
    }
  },
};
