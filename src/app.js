const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://notepad-loozzi.surge.sh",
      "https://notepad-loozzi.surge.sh",
      "http://notepad-loozzi.vercel.app",
      "https://notepad-loozzi.vercel.app",
      "*",
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);

mongoose.connect(
  process.env.MONGODB_CONNECTION,
  { serverSelectionTimeoutMS: 3000 },
  (err) => {
    if (err) {
      console.log("Database connection failed: " + err.message);
    } else {
      console.log("Database connection successful");
    }
  }
);

mongoose.connection.on("connected", () => {
  console.log("Connected to database");
});

mongoose.connection.on("error", (err) => {
  console.log("Database connection error: " + err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from database");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

const refreshTokenRoutes = require("./v1/routes/refreshToken.route");
const userRoutes = require("./v1/routes/user.route");
const noteRoutes = require("./v1/routes/note.route");

app.use("/api/v1/refreshToken", refreshTokenRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/note", noteRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    code: 404,
    message: "Page not found",
  });
});

app.use((err, req, res, next) => {
  logEvents(`${req.url}----${req.method}----${err.message}`);
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message,
  });
});

module.exports = app;
