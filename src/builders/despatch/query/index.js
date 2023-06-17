module.exports = {
    headerBuilder: require("./src/headerBuilder"),
    despatchesBuilder: require("./src/despatchesQuery"),
    orderBuilder: require("./src/orderQuery"),
    notesBuilder: require("./src/notesBuilder"),
    linesBuilder: require("./src/linesBuilder"),
    customerBuilder: require("./src/customerBuilder"),
    shipmentDriverBuilder: require("./src/shipmentDriverBuilder"),
    shipmentCarrierBuilder: require("./src/shipmentCarrierBuilder"),
    shipmentDeliveryBuilder: require("./src/shipmentDeliveryBuilder"),
    checkUnsended: require("./src/checkUnsended"),
    updDespNumFn: require("./src/updDespNumFn"),
};
