-- AlterTable
ALTER TABLE "public"."projects" DROP COLUMN "architectureImage";

-- AlterTable
ALTER TABLE "public"."system_architectures" DROP COLUMN "description",
DROP COLUMN "metrics",
DROP COLUMN "name",
DROP COLUMN "title",
ADD COLUMN "imageUrl" TEXT NOT NULL DEFAULT '';
