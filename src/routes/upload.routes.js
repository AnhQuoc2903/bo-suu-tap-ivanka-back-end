const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload.middleware");
const { requireAdmin } = require("../middlewares/auth.middleware");
const cloudinary = require("../config/cloudinary");

router.post(
  "/",
  requireAdmin,
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Vui lòng chọn ảnh để tải lên.",
        });
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "ivanka-gallery",
            resource_type: "image",
          },
          (error, uploadedImage) => {
            if (error) return reject(error);
            resolve(uploadedImage);
          },
        );

        stream.end(req.file.buffer);
      });

      res.status(201).json({
        message: "Tải ảnh lên Cloudinary thành công.",
        image: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
