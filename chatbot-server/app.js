var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

require("dotenv").config();
require("./utils/telegramBot")();
const watsonRoutes = require("./routes/watson");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "build")));

app.use("/api/watson", watsonRoutes);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

module.exports = app;
