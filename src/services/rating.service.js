const ratingRepository = require("../repositories/rating.repository");
const imageRepository = require("../repositories/image.repository");
const AppError = require("../utils/app-error");

class RatingService {
  async getStats(imageId) {
    const image = await imageRepository.findById(imageId);

    if (!image) {
      throw new AppError("Không tìm thấy ảnh", 404);
    }

    const groups = await ratingRepository.getImageRatingStats(imageId);

    const distribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    let total = 0;
    let scoreSum = 0;

    for (const group of groups) {
      const score = group.score;
      const count = group._count._all;

      distribution[score] = count;
      total += count;
      scoreSum += score * count;
    }

    return {
      imageId,
      average: total > 0 ? Number((scoreSum / total).toFixed(2)) : 0,
      total,
      distribution,
    };
  }

  async createRating(imageId, visitorId, score) {
    const image = await imageRepository.findById(imageId);

    if (!image) {
      throw new AppError("Không tìm thấy ảnh", 404);
    }

    if (!Number.isInteger(score) || score < 1 || score > 5) {
      throw new AppError("Số sao phải là số nguyên từ 1 đến 5", 400);
    }

    if (
      typeof visitorId !== "string" ||
      visitorId.trim().length === 0 ||
      visitorId.length > 100
    ) {
      throw new AppError("Mã người đánh giá không hợp lệ", 400);
    }

    await ratingRepository.create({ imageId, visitorId, score });

    return this.getStats(imageId);
  }
}

module.exports = new RatingService();
