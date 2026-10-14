-- CreateTable
CREATE TABLE "ratings" (
    "id" SERIAL NOT NULL,
    "imageId" INTEGER NOT NULL,
    "visitorId" VARCHAR(100) NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ratings_imageId_score_idx" ON "ratings"("imageId", "score");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_imageId_visitorId_key" ON "ratings"("imageId", "visitorId");

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
