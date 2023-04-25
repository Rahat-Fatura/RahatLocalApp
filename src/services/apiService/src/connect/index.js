const connect = require("../connection");

module.exports = {
    rmq_code: () => {
        return new Promise((resolve, reject) => {
            connect("get", `/connect/ping`, null)
                .then((result) => {
                    console.log('connected :>> ');
                    resolve(result);
                })
                .catch((error) => {
                    console.log('not connected :>> ');
                    reject(error);
                });
        });
    },
    invoice: require("./invoice"),
};
