const sql = require("mssql");
const config = require("config");

module.exports = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const sqlConnection = await sql.connect(
                config.get("local.mssql.url")
            );
            const connection = sqlConnection.request();
            return resolve(connection);
        } catch (error) {
            return reject(error);
        }
    });
};
