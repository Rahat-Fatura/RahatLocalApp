const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// const fetch = require("node-fetch");
const axios = require("axios");
const config = require("config");

const argv = require("yargs-parser")(process.argv.slice(2));

async function main() {
    let inv_queries = {};
    let dsp_queries = {};
    console.log("argv", argv);
    if (argv.url && argv.key) {
        let str_ax = await axios.get(
            `${argv.url}/erps/${argv.erp}?populate[0]=queries&populate[1]=ekeyes`,
            {
                headers: {
                    Authorization: `Bearer ${argv.key}`,
                },
            }
        );
        let queries =
            str_ax.data?.data?.attributes?.queries?.data[0]?.attributes;

        if (str_ax.data.data.attributes.ekeyes.data.length > 0) {
            let keys = str_ax.data.data.attributes.ekeyes.data.map((e) => {
                return e.attributes.name;
            });
            if (keys.length > 0) {
                for await (key of keys) {
                    if (!argv[key]) {
                        console.log(
                            "İlgili erp için gerekli keyler eksik. Lütfen kontrol ediniz."
                        );
                        process.exit(1);
                    }
                    queries["invoiceHeader"] = queries["invoiceHeader"]?.replaceAll(
                        `{{${key}}}`,
                        argv[key]
                    );
                    queries["invoiceCustomer"] = queries[
                        "invoiceCustomer"
                    ]?.replaceAll(`{{${key}}}`, argv[key]);
                    queries["invoiceLines"] = queries["invoiceLines"]?.replaceAll(
                        `{{${key}}}`,
                        argv[key]
                    );
                    queries["invoiceNotes"] = queries["invoiceNotes"]?.replaceAll(
                        `{{${key}}}`,
                        argv[key]
                    );
                    queries["invoiceDespatches"] = queries[
                        "invoiceDespatches"
                    ]?.replaceAll(`{{${key}}}`, argv[key]);
                    queries["invoiceOrder"] = queries["invoiceOrder"]?.replaceAll(
                        `{{${key}}}`,
                        argv[key]
                    );
                    queries["invoiceLineTaxes"] = queries[
                        "invoiceLineTaxes"
                    ]?.replaceAll(`{{${key}}}`, argv[key]);
                    queries["invoiceUpdateNumber"] = queries[
                        "invoiceUpdateNumber"
                    ]?.replaceAll(`{{${key}}}`, argv[key]);
                    queries["invoiceListNotSended"] = queries[
                        "invoiceListNotSended"
                    ]?.replaceAll(`{{${key}}}`, argv[key]);
                    queries["despatchHeader"] = queries[
                        "despatchHeader"
                    ]?.replaceAll(`{{${key}}}`, argv[key]);
                    queries["despatchCustomer"] = queries[
                        "despatchCustomer"
                    ]?.replaceAll(`{{${key}}}`, argv[key]);
                    queries["despatchLines"] = queries["despatchLines"]?.replaceAll(
                        `{{${key}}}`,
                        argv[key]
                    );
                    queries["despatchNotes"] = queries["despatchNotes"]?.replaceAll(
                        `{{${key}}}`,
                        argv[key]
                    );
                    queries["despatchOrder"] = queries["despatchOrder"]?.replaceAll(
                        `{{${key}}}`,
                        argv[key]
                    );
                    queries["despatchUpdateNumber"] = queries[
                        "despatchUpdateNumber"
                    ]?.replaceAll(`{{${key}}}`, argv[key]);
                    queries["despatchListNotSended"] = queries[
                        "despatchListNotSended"
                    ]?.replaceAll(`{{${key}}}`, argv[key]);
                    queries["despatchShipmentDriver"] = queries[
                        "despatchShipmentDriver"
                    ]?.replaceAll(`{{${key}}}`, argv[key]);
                    queries["despatchShipmentCarrier"] = queries[
                        "despatchShipmentCarrier"
                    ]?.replaceAll(`{{${key}}}`, argv[key]);
                    queries["despatchShipmentDelivery"] = queries[
                        "despatchShipmentDelivery"
                    ]?.replaceAll(`{{${key}}}`, argv[key]);
                }
            }
        }

        if (queries) {
            if (argv.i) {
                inv_queries = {
                    header_query: queries.invoiceHeader,
                    customer_query: queries.invoiceCustomer,
                    lines_query: queries.invoiceLines,
                    notes_query: queries.invoiceNotes,
                    despatches_query: queries.invoiceDespatches,
                    order_query: queries.invoiceOrder,
                    lines_taxes_query: queries.invoiceLineTaxes,
                    up_inv_num_query: queries.invoiceUpdateNumber,
                    check_unsended_invoices_query: queries.invoiceListNotSended,
                };
            }
            if (argv.d) {
                dsp_queries = {
                    header_query: queries.despatchHeader,
                    customer_query: queries.despatchCustomer,
                    lines_query: queries.despatchLines,
                    notes_query: queries.despatchNotes,
                    order_query: queries.despatchOrder,
                    up_desp_num_query: queries.despatchUpdateNumber,
                    check_unsended_despatches_query:
                        queries.despatchListNotSended,
                    shipment_driver_query: queries.despatchShipmentDriver,
                    shipment_carrier_query: queries.despatchShipmentCarrier,
                    shipment_delivery_query: queries.despatchShipmentDelivery,
                };
            }
        }
    }
    const invoice_query = await prisma.InvoiceQueries.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            ...inv_queries,
        },
    });

    const despatch_query = await prisma.DespatchQueries.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            ...dsp_queries,
        },
    });
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
