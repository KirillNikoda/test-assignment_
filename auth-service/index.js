require("dotenv").config();
const express = require("express");
const amqp = require("amqplib/callback_api");
const app = express();
const { register, login } = require("./controllers/auth.controller");
const mongoose = require("mongoose");

app.use(express.json());

exports.queues = {
  register: "register",
  registerFinished: "registerFinished",
};

amqp.connect(process.env.AMQP_URI, (error0, connection) => {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    app.post("/auth/register", register);
    app.post("/auth/login", login)

    app.listen(3001, () => {
      console.log("started listening on port 3001");
    });
  });
  process.on("beforeExit", () => {
    connection.close();
  });
});
