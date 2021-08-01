const express = require("express");
const amqp = require("amqplib/callback_api");
const app = express()

amqp.connect("amqps://rrqgpuzw:6kXQenIdFGn76hAtC-qEUcTgTflFaVet@roedeer.rmq.cloudamqp.com/rrqgpuzw", (error0, connection) => {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    const queue = "hello"
    const msg = "hello microservice"

    channel.assertQueue(queue, {
      durable: false,
    });

    app.get("/", (req, res) => {
      channel.sendToQueue(queue, Buffer.from(msg))
      res.send("Success")
    })

    app.listen(3001, () => {
      console.log("started listening on port 3000")
    })

  });
});
