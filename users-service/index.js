require("dotenv").config()
const express = require("express");
const amqp = require("amqplib/callback_api");
const mongoose = require("mongoose");
const {REGISTER_USER} = require("./constants/constants");
const {createUser} = require("./controllers/user.controller");
const app = express();


app.use(express.json())

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
    .then(_ => {
        amqp.connect(process.env.AMQP_URI, (error0, connection) => {
            if (error0) {
                throw error0;
            }

            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }

                app.post("/users", createUser)
                app.get("/users", getUsers)
                app.get("/users/:id", getUser)
            });
        });

    })
