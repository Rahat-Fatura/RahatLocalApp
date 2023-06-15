const connect = require("../../../../local");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = (id, db_type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let notesQueryObject = await prisma.despatchQueries.findFirst({});
            let notesQuery = notesQueryObject.notes_query;
            if (notesQuery) {
                connect(db_type).then((connection) => {
                    connection
                        .input("erpId", id)
                        .query(notesQuery)
                        .then((result) => {
                            resolve(result.recordset);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                });
            } else resolve({});
        } catch (error) {
            reject(error);
        }
    });
};
