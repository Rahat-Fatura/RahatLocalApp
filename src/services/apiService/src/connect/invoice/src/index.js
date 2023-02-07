const connect = require("../../../connection");

const insertInvoice = (body, test) => {
    return new Promise((resolve, reject) => {
        connect("post", `/connect/invoice`, body, test)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const updateInvoice = (body, test) => {
    return new Promise((resolve, reject) => {
        connect("put", `/connect/invoice`, body, test)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const deleteInvoice = (ex_id, test) => {
    return new Promise((resolve, reject) => {
        connect("delete", `/connect/invoice/${ex_id}`, null, test)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

module.exports = {
    insertInvoice,
    updateInvoice,
    deleteInvoice,
};
