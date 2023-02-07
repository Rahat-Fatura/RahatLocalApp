const connect = require("../connection");

module.exports = {
    rmq_code: () => {
        return new Promise((resolve, reject) => {
            connect("get", `/connect/ping`, null)
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    invoice: require("./invoice"),
};
