const express = require("express");
const middleware = require("../utils/middleware");
const noteController = require("../controllers/note.controller");

const router = express.Router();

router.get("/", noteController.get);

router.get("/all", middleware.isLogging, noteController.getAll);

router.post("/", middleware.isLogging, noteController.create);

router.put("/", middleware.isLogging, noteController.edit);

router.delete("/", middleware.isLogging, noteController.delete);

module.exports = router;
