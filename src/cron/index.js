const cron = require("node-cron");
const config = require("config");

module.exports = (app) => {
    cron.schedule(
        config.get("settings.checkUnsendedInvoice.workingPeriod"),
        () => {
            require("./src/checkUnsendedInvoices")(app);
        }
    );

    cron.schedule(
        config.get("settings.checkUnsendedDespatch.workingPeriod"),
        () => {
            require("./src/checkUnsendedDespatches")(app);
        }
    );

    // require("./src/checkUnsendedInvoices")();
};
