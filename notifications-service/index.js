require("dotenv").config();
const amqp = require("amqplib/callback_api");
const nodemailer = require("nodemailer");
const {sendNotification} = require("./utils/sendNotification");

const queues = {
  registered: "registered",
};

amqp.connect(process.env.AMQP_URI, (error0, connection) => {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.PASSWORD, // generated ethereal password
      },
    });


    channel.assertQueue("registered", {
      durable: false,
    });

    channel.assertQueue("user_logged_in", {
      durable: false,
    })

    channel.consume("user_logged_in", async (msg) => {
      const email = msg.content.toString()

      await sendNotification("You logged in your account.", transporter, email)
    })

    channel.consume(queues.registered, async (msg) => {
      const email = msg.content.toString()

      await sendNotification("You finished registration process.", transporter, email)
    });
  });
});
