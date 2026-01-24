-- CreateTable
CREATE TABLE "sub_customers" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "business_name" VARCHAR(100) NOT NULL,
    "external_code" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_locations" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "sub_customer_id" TEXT,
    "name" VARCHAR(100) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "zip_code" VARCHAR(20),
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sub_customers_customer_id_external_code_key" ON "sub_customers"("customer_id", "external_code");

-- AddForeignKey
ALTER TABLE "sub_customers" ADD CONSTRAINT "sub_customers_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_locations" ADD CONSTRAINT "customer_locations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_locations" ADD CONSTRAINT "customer_locations_sub_customer_id_fkey" FOREIGN KEY ("sub_customer_id") REFERENCES "sub_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
