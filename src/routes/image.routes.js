const express = require("express");
const imageController = require("../controllers/image.controller");
const ratingController = require("../controllers/rating.controller");
const { requireAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/:id/ratings", (req, res, next) =>
  ratingController.getStats(req, res, next),
);

router.post("/:id/ratings", (req, res, next) =>
  ratingController.createRating(req, res, next),
);

router.get("/", (req, res, next) => imageController.getImages(req, res, next));

router.get("/categories", (req, res, next) =>
  imageController.getCategories(req, res, next),
);

router.get("/:id", (req, res, next) =>
  imageController.getImageById(req, res, next),
);

router.post("/", requireAdmin, (req, res, next) =>
  imageController.createImage(req, res, next),
);

router.put("/:id", requireAdmin, (req, res, next) =>
  imageController.updateImage(req, res, next),
);

router.delete("/:id", requireAdmin, (req, res, next) =>
  imageController.deleteImage(req, res, next),
);

module.exports = router;
