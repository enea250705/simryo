-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "planId" TEXT,
ADD COLUMN     "providerId" TEXT,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
