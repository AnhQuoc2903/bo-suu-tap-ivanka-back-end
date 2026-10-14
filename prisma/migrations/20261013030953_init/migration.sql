-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "images_category_idx" ON "images"("category");

-- CreateIndex
CREATE INDEX "images_date_idx" ON "images"("date");
