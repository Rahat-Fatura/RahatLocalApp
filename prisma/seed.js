const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const invoice_query = await prisma.InvoiceQueries.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id : 1,
      header_query: `select 
      LOGICALREF AS external_id, 
      FICHENO AS external_refno, 
      'LOGO:rahatLocalApp:022:01' AS external_type, 
      DATE_ AS IssueDateTime, 
      'SATIS' AS Type 
    from 
      LG_022_01_INVOICE 
    where 
      TRCODE IN(6, 7, 8, 9) 
      and LOGICALREF = @erpId`,
      customer_query : `SELECT 
      (
        CASE ISPERSCOMP WHEN 1 THEN CASE WHEN ISNULL(TCKNO, '') = '' THEN '1111111111' ELSE REPLACE(
          RTRIM(
            LTRIM(TCKNO)
          ), 
          ' ', 
          ''
        ) END ELSE CASE WHEN ISNULL(TAXNR, '') = '' THEN '1111111111' ELSE REPLACE(
          LTRIM(
            RTRIM(TAXNR)
          ), 
          ' ', 
          ''
        ) END END
      ) AS TaxNumber, 
      TAXOFFICE AS TaxOffice, 
      LTRIM(
        RTRIM(DEFINITION_)
      ) AS Name, 
      LTRIM(
        RTRIM(ADDR1 + ' ' + ADDR2)
      ) AS Address, 
      LTRIM(
        RTRIM(DISTRICT + ' ' + TOWN)
      ) AS District, 
      CITY as City, 
      CASE WHEN ISNULL(MST.COUNTRY, '') = '' THEN 'TÜRKİYE' ELSE MST.COUNTRY END AS Country, 
      POSTCODE AS PostalCode, 
      TELNRS1 AS Phone, 
      EMAILADDR AS Mail 
    FROM 
      dbo.LG_022_01_INVOICE AS INV 
      JOIN dbo.LG_022_CLCARD AS MST ON INV.CLIENTREF = MST.LOGICALREF 
    WHERE 
      INV.LOGICALREF = @erpId`,
      lines_query : `SELECT (
        CASE STL.LINETYPE WHEN 0 THEN ITM.NAME WHEN 8 THEN ITM.NAME WHEN 2 THEN SRV.CODE WHEN 4 THEN SRV.CODE END
        )             AS Name,
    STL.AMOUNT        AS Quantity,
    CASE (
        ISNULL(USL.CODE, '')
        )
        WHEN 'AD' THEN 'C62'
        WHEN 'PAKET' THEN 'PA'
        WHEN 'KOLİ' THEN 'BX'
        WHEN 'LT' THEN 'LTR'
        WHEN 'KĞ' THEN 'KGM'
        WHEN 'ÇUVAL' THEN 'SA'
        WHEN 'KOLİ' THEN 'BX'
        WHEN 'ADET' THEN 'C62'
        WHEN 'KG' THEN 'KGM'
        WHEN 'PKT' THEN 'PA'
        WHEN 'ADET' THEN 'C62'
        WHEN 'DZ' THEN 'DPC'
        WHEN 'GROSA' THEN 'GRO'
        WHEN 'ZARF' THEN 'EV'
        WHEN 'KUTU' THEN 'BX'
        WHEN 'SET' THEN 'SET'
        ELSE NULL END AS UnitCode,
    STL.PRICE         AS Price,
    STL.VAT           AS KDVPercent,
    null              AS AllowancePercent,
    null              AS WithholdingTaxCode
FROM dbo.LG_022_01_STLINE AS STL
      LEFT OUTER JOIN dbo.LG_022_ITEMS AS ITM WITH (NOLOCK) ON STL.STOCKREF = ITM.LOGICALREF
      LEFT OUTER JOIN dbo.LG_022_SRVCARD AS SRV WITH (NOLOCK) ON STL.STOCKREF = SRV.LOGICALREF
      LEFT OUTER JOIN dbo.LG_022_UNITSETL AS USL WITH (NOLOCK) ON STL.UOMREF = USL.LOGICALREF
      LEFT OUTER JOIN dbo.LG_022_01_INVOICE AS INV WITH (NOLOCK) ON STL.INVOICEREF = INV.LOGICALREF
WHERE (STL.PARENTLNREF = 0)
AND (STL.BILLED = 1)
AND INV.LOGICALREF = @erpId
`,
      up_inv_num_query : `UPDATE LG_022_01_INVOICE SET FICHENO = @invNo WHERE LOGICALREF = @erpId`,
      check_unsended_invoices_query : `SELECT 
      LOGICALREF AS external_id, 
      FICHENO AS external_refno
    FROM 
      LG_022_01_INVOICE 
    WHERE 
      TRCODE IN(6, 7, 8, 9)
      and DATE_ >= @dateTime`,
    },
  })

  const despatch_query = await prisma.DespatchQueries.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id : 1,
      header_query: `select 
      LOGICALREF AS external_id, 
      FICHENO AS external_refno, 
      'LOGO:rahatLocalApp:022:01' AS external_type, 
      DATE_ AS IssueDateTime, 
      'SATIS' AS Type 
    from 
      LG_022_01_INVOICE 
    where 
      TRCODE IN(6, 7, 8, 9) 
      and LOGICALREF = @erpId`,
      customer_query : `SELECT 
      (
        CASE ISPERSCOMP WHEN 1 THEN CASE WHEN ISNULL(TCKNO, '') = '' THEN '1111111111' ELSE REPLACE(
          RTRIM(
            LTRIM(TCKNO)
          ), 
          ' ', 
          ''
        ) END ELSE CASE WHEN ISNULL(TAXNR, '') = '' THEN '1111111111' ELSE REPLACE(
          LTRIM(
            RTRIM(TAXNR)
          ), 
          ' ', 
          ''
        ) END END
      ) AS TaxNumber, 
      TAXOFFICE AS TaxOffice, 
      LTRIM(
        RTRIM(DEFINITION_)
      ) AS Name, 
      LTRIM(
        RTRIM(ADDR1 + ' ' + ADDR2)
      ) AS Address, 
      LTRIM(
        RTRIM(DISTRICT + ' ' + TOWN)
      ) AS District, 
      CITY as City, 
      CASE WHEN ISNULL(MST.COUNTRY, '') = '' THEN 'TÜRKİYE' ELSE MST.COUNTRY END AS Country, 
      POSTCODE AS PostalCode, 
      TELNRS1 AS Phone, 
      EMAILADDR AS Mail 
    FROM 
      dbo.LG_022_01_INVOICE AS INV 
      JOIN dbo.LG_022_CLCARD AS MST ON INV.CLIENTREF = MST.LOGICALREF 
    WHERE 
      INV.LOGICALREF = @erpId`,
      lines_query : `SELECT (
        CASE STL.LINETYPE WHEN 0 THEN ITM.NAME WHEN 8 THEN ITM.NAME WHEN 2 THEN SRV.CODE WHEN 4 THEN SRV.CODE END
        )             AS Name,
    STL.AMOUNT        AS Quantity,
    CASE (
        ISNULL(USL.CODE, '')
        )
        WHEN 'AD' THEN 'C62'
        WHEN 'PAKET' THEN 'PA'
        WHEN 'KOLİ' THEN 'BX'
        WHEN 'LT' THEN 'LTR'
        WHEN 'KĞ' THEN 'KGM'
        WHEN 'ÇUVAL' THEN 'SA'
        WHEN 'KOLİ' THEN 'BX'
        WHEN 'ADET' THEN 'C62'
        WHEN 'KG' THEN 'KGM'
        WHEN 'PKT' THEN 'PA'
        WHEN 'ADET' THEN 'C62'
        WHEN 'DZ' THEN 'DPC'
        WHEN 'GROSA' THEN 'GRO'
        WHEN 'ZARF' THEN 'EV'
        WHEN 'KUTU' THEN 'BX'
        WHEN 'SET' THEN 'SET'
        ELSE NULL END AS UnitCode,
    STL.PRICE         AS Price,
    STL.VAT           AS KDVPercent,
    null              AS AllowancePercent,
    null              AS WithholdingTaxCode
FROM dbo.LG_022_01_STLINE AS STL
      LEFT OUTER JOIN dbo.LG_022_ITEMS AS ITM WITH (NOLOCK) ON STL.STOCKREF = ITM.LOGICALREF
      LEFT OUTER JOIN dbo.LG_022_SRVCARD AS SRV WITH (NOLOCK) ON STL.STOCKREF = SRV.LOGICALREF
      LEFT OUTER JOIN dbo.LG_022_UNITSETL AS USL WITH (NOLOCK) ON STL.UOMREF = USL.LOGICALREF
      LEFT OUTER JOIN dbo.LG_022_01_INVOICE AS INV WITH (NOLOCK) ON STL.INVOICEREF = INV.LOGICALREF
WHERE (STL.PARENTLNREF = 0)
AND (STL.BILLED = 1)
AND INV.LOGICALREF = @erpId
`,
      up_desp_num_query : `UPDATE LG_022_01_INVOICE SET FICHENO = @invNo WHERE LOGICALREF = @erpId`,
      check_unsended_despatches_query : `SELECT 
      LOGICALREF AS external_id, 
      FICHENO AS external_refno
    FROM 
      LG_022_01_STFICHE 
    WHERE 
      TRCODE IN(7, 8, 9, 10)
      and DATE_ >= @dateTime`,
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })