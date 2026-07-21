-- DropTable
DROP TABLE IF EXISTS "public"."visual_showcases";

-- AlterTable (remove columns from hero_config)
ALTER TABLE "public"."hero_config" DROP COLUMN IF EXISTS "availability";

-- AlterTable (remove columns from projects)
ALTER TABLE "public"."projects" DROP COLUMN IF EXISTS "featuredImage";
ALTER TABLE "public"."projects" DROP COLUMN IF EXISTS "blueprintImage";
ALTER TABLE "public"."projects" DROP COLUMN IF EXISTS "metricsImage";
