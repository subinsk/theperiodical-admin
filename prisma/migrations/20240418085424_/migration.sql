/*
  Warnings:

  - You are about to drop the column `content` on the `Gist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Gist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Gist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gist" DROP COLUMN "content",
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gistId" TEXT,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Topic_id_key" ON "Topic"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Gist_slug_key" ON "Gist"("slug");

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_gistId_fkey" FOREIGN KEY ("gistId") REFERENCES "Gist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
