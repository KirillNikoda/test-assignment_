require("dotenv").config();
const express = require("express");
const amqp = require("amqplib/callback_api");
const mongoose = require("mongoose");
const { createUser, getUser, updateUser} = require("./controllers/user.controller");
const { User } = require("./models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const {authMiddleware} = require("./middlewares/auth");

const queues = {
  register: "register",
  registerFinished: "registerFinished",
};

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((_) => {
    console.log("db connected");
    amqp.connect(process.env.AMQP_URI, (error0, connection) => {
      if (error0) {
        throw error0;
      }

      connection.createChannel((error1, channel) => {
        if (error1) {
          throw error1;
        }

        const app = express();
        app.use(express.json());

        app.post("/users/login", async (req, res) => {
          const user = await User.findOne({ email: req.body.email });

          if (!user) {
            return res.status(404).send({
              err: "Invalid credentials.",
            });
          }

          const isValidPassword = await bcrypt.compare(req.body.password, user.password);

          if (!isValidPassword) {
            return res.status(400).send({
              err: "Invalid credentials.",
            });
          }

          const payload = {
            _id: user._id
          }

          const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "1h"
          })

          res.send({
            token
          })
        });

        app.get("/users/:email", async (req, res) => {
          const user = await User.findOne({email: req.params.email});
          res.send({
            user
          })
        })

        app.post("/users", async (req, res) => {
          const newUser = new User(req.body);
          await newUser.save();
          res.send({
            user: newUser
          })
        })

        app.get("/users/id/:id", getUser);
        app.put("/users/:id", authMiddleware, updateUser)

        app.listen("3002", () => {
          console.log("started on port 3002");
        });
      });
      process.on("beforeExit", () => {
        connection.close();
      });
    });
  });
