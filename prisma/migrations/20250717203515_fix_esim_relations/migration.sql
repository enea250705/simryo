-- DropForeignKey
ALTER TABLE "Esim" DROP CONSTRAINT "Esim_planId_fkey";

-- DropForeignKey
ALTER TABLE "Esim" DROP CONSTRAINT "Esim_providerId_fkey";

-- AlterTable
ALTER TABLE "Esim" ALTER COLUMN "planId" DROP NOT NULL,
ALTER COLUMN "providerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Esim" ADD CONSTRAINT "Esim_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Esim" ADD CONSTRAINT "Esim_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
