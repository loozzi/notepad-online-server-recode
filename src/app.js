const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();
app.use(morgan("common"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  })
);

mongoose.connect(
  "mongodb+srv://loozzi_myapp:pI5NCGIey19ga1nK@cluster0.hqs96.mongodb.net/notepad_online",
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
