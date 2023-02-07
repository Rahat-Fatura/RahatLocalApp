module.exports = (db_type) => {
    return new Promise((resolve, reject) => {
        if (!db_type) {
            reject("DB type required!");
        }
        try {
            const connect = require(`./${db_type}/connect`)();
            resolve(connect);
        } catch (error) {
            reject(error);
        }
    });
};
