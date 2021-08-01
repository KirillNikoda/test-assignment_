require('dotenv').config();
const express = require('express');
const amqp = require('amqplib/callback_api');
const app = express();
const { register, login } = require('./controllers/auth.controller');
const mongoose = require('mongoose');
const { LOGIN_USER } = require('./constants/constants');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((_) => {
    console.log('connected to database');
    amqp.connect(process.env.AMQP_URI, (error0, connection) => {
      if (error0) {
        throw error0;
      }

      connection.createChannel((error1, channel) => {
        if (error1) {
          throw error1;
        }

        channel.assertQueue(LOGIN_USER, {
          durable: false,
        });

        app.post('/users/register', register(channel));

        app.post('/users/login', login(channel));

        app.listen(3001, () => {
          console.log('started listening on port 3000');
        });
      });
    });
  });
