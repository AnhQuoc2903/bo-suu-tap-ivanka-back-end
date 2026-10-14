const prisma = require("../config/database");

class RatingRepository {
  getByImageId(imageId) {
    return prisma.rating.findMany({
      where: { imageId },
      select: {
        score: true,
        visitorId: true,
      },
    });
  }

  create(data) {
    return prisma.rating.create({
      data,
    });
  }

  getImageRatingStats(imageId) {
    return prisma.rating.groupBy({
      by: ["score"],
      where: { imageId },
      _count: {
        _all: true,
      },
    });
  }
}

module.exports = new RatingRepository();
