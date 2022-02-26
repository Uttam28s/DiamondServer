const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const env = require("dotenv").config().parsed;
const port = env.APP_PORT || 3002;
const passport = require("passport");
const { roughRoutes, officeRoutes, commonRoutes } = require("./Routes");

const dConnection =
  env.DB_CONNECTION +
  "://" +
  env.DB_HOST +
  ":" +
  env.DB_PORT +
  "/" +
  env.DB_DATABASE;

const options = {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
};
mongoose
  .connect(dConnection, options)
  .then(() => {
    console.log("DB Connected!");
  })
  .catch((err) => {
    throw new Error("Database credentials are invalid.");
  });

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "OPTIONS,GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use("/api/auth", authRoute);
app.use("/api/rough", roughRoutes);
app.use("/api/office", officeRoutes);
app.use("/api/common", commonRoutes);

app.use(passport.initialize());
app.use(passport.session());

// require("./config/passport")(passport);

app.listen(port, () => {
  console.log("server started on", port);
});
