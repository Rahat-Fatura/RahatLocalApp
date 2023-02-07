const amqp = require("amqplib");
const config = require("config");
let channel, connection;

module.exports = (host) => {
    return new Promise(async (resolve, reject) => {
        try {
            connection = await amqp.connect(
                config.get(`services.rabbitmq.${host}`)
            );
            channel = await connection.createChannel();

            connection.on("error", (err) => {
                console.log("rabbitmq-error-global-1 :>> ", err);
            });

            resolve([channel, connection]);
        } catch (error) {
            console.log("rabbitmq-connection-error-1 :>> ", error);
            reject(error);
        }
    });
};
