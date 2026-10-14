const ratingService = require("../services/rating.service");

class RatingController {
  async getStats(req, res, next) {
    try {
      const imageId = Number(req.params.id);

      if (!Number.isSafeInteger(imageId) || imageId <= 0) {
        return res.status(400).json({
          message: "ID ảnh không hợp lệ",
        });
      }

      const result = await ratingService.getStats(imageId);

      return res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async createRating(req, res, next) {
    try {
      const imageId = Number(req.params.id);
      const { visitorId, score } = req.body;

      if (!Number.isSafeInteger(imageId) || imageId <= 0) {
        return res.status(400).json({
          message: "ID ảnh không hợp lệ",
        });
      }

      const result = await ratingService.createRating(
        imageId,
        visitorId,
        score,
      );

      return res.status(201).json({
        message: "Đánh giá thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RatingController();
