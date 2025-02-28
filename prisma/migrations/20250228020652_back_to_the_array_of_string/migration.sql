/*
  Warnings:

  - You are about to drop the `BlogTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BlogTag" DROP CONSTRAINT "BlogTag_blogId_fkey";

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "tag" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "BlogTag";
