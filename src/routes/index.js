const express = require("express");
const imageRoutes = require("./image.routes");
const uploadRoutes = require("./upload.routes");
const categoryRoutes = require("./category.routes");

const router = express.Router();

router.use("/images", imageRoutes);
router.use("/upload", uploadRoutes);
router.use("/categories", categoryRoutes);

module.exports = router;
