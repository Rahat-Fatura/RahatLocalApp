const connect = require("../../../connection");

const insertDespatch = (body, test) => {
    return new Promise((resolve, reject) => {
        connect("post", `/connect/despatch`, body, test)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const updateDespatch = (body, test) => {
    return new Promise((resolve, reject) => {
        connect("put", `/connect/despatch`, body, test)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const deleteDespatch = (ex_id, test) => {
    return new Promise((resolve, reject) => {
        connect("delete", `/connect/despatch/${ex_id}`, null, test)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

module.exports = {
    insertDespatch,
    updateDespatch,
    deleteDespatch,
};
