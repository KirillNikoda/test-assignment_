const amqp = require("amqplib/callback_api");


amqp.connect("amqps://rrqgpuzw:6kXQenIdFGn76hAtC-qEUcTgTflFaVet@roedeer.rmq.cloudamqp.com/rrqgpuzw", (error0, connection) => {
    if (error0) {
        throw error0;
    }

    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        const queue = "hello"


        channel.assertQueue(queue, {
            durable: false,
        });



    });
});