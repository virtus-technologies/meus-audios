-- AlterTable
ALTER TABLE "Audio" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Audio_userId_isFavorite_idx" ON "Audio"("userId", "isFavorite");
