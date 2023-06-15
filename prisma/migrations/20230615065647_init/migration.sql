-- CreateTable
CREATE TABLE "InvoiceQueries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" DATETIME,
    "header_query" TEXT,
    "customer_query" TEXT,
    "lines_query" TEXT,
    "notes_query" TEXT,
    "despatches_query" TEXT,
    "order_query" TEXT,
    "up_inv_num_query" TEXT,
    "check_unsended_invoices_query" TEXT
);

-- CreateTable
CREATE TABLE "DespatchQueries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" DATETIME,
    "header_query" TEXT,
    "customer_query" TEXT,
    "lines_query" TEXT,
    "notes_query" TEXT,
    "despatches_query" TEXT,
    "order_query" TEXT,
    "up_desp_num_query" TEXT,
    "check_unsended_despatches_query" TEXT
);

-- CreateTable
CREATE TABLE "Invoices" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" DATETIME,
    "external_id" TEXT NOT NULL,
    "external_code" TEXT NOT NULL,
    "json" TEXT,
    "status" INTEGER NOT NULL,
    "status_desc" TEXT NOT NULL,
    "sending_type" TEXT,
    "updated_data" TEXT
);

-- CreateTable
CREATE TABLE "Despatches" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" DATETIME,
    "external_id" TEXT NOT NULL,
    "external_code" TEXT NOT NULL,
    "json" TEXT,
    "status" INTEGER NOT NULL,
    "status_desc" TEXT NOT NULL,
    "sending_type" TEXT,
    "updated_data" TEXT
);

-- CreateTable
CREATE TABLE "Logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" DATETIME
);
