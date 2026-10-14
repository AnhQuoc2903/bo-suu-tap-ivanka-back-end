const imageService = require("../services/image.service");
const { imageSchema } = require("../validators/image.validator");
const AppError = require("../utils/app-error");

function parseId(value) {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id < 1) {
    throw new AppError("ID ảnh không hợp lệ", 400);
  }

  return id;
}

function validateBody(body) {
  const result = imageSchema.safeParse(body);

  if (!result.success) {
    return {
      success: false,
      response: {
        message: "Dữ liệu không hợp lệ",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    };
  }

  return { success: true, data: result.data };
}

class ImageController {
  async getImages(req, res, next) {
    try {
      res.json(await imageService.getImages(req.query));
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req, res, next) {
    try {
      res.json(await imageService.getCategories());
    } catch (error) {
      next(error);
    }
  }

  async getImageById(req, res, next) {
    try {
      res.json(await imageService.getImageById(parseId(req.params.id)));
    } catch (error) {
      next(error);
    }
  }

  async createImage(req, res, next) {
    try {
      const validation = validateBody(req.body);

      if (!validation.success) {
        return res.status(400).json(validation.response);
      }

      const image = await imageService.createImage(validation.data);
      res.status(201).json(image);
    } catch (error) {
      next(error);
    }
  }

  async updateImage(req, res, next) {
    try {
      const id = parseId(req.params.id);
      const validation = validateBody(req.body);

      if (!validation.success) {
        return res.status(400).json(validation.response);
      }

      const image = await imageService.updateImage(id, validation.data);
      res.json(image);
    } catch (error) {
      next(error);
    }
  }

  async deleteImage(req, res, next) {
    try {
      const id = parseId(req.params.id);
      res.json(await imageService.deleteImage(id));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ImageController();
