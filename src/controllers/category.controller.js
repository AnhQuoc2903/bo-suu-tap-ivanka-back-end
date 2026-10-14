const { categoryService } = require("../services/category.service");

function getErrorStatus(message) {
  if (
    message === "Vui lòng nhập tên danh mục." ||
    message === "Tên danh mục không hợp lệ." ||
    message === "Danh mục này đã tồn tại." ||
    message === "Tên danh mục này đã được sử dụng." ||
    message ===
      "Không thể xóa danh mục đang có ảnh. Hãy chuyển ảnh sang danh mục khác trước."
  ) {
    return 400;
  }

  if (message === "Không tìm thấy danh mục.") {
    return 404;
  }

  return 500;
}

const categoryController = {
  async getAll(req, res, next) {
    try {
      const categories = await categoryService.getAll();
      res.json({ data: categories });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res) {
    try {
      const category = await categoryService.create(req.body?.name);

      res.status(201).json({
        message: "Tạo danh mục thành công.",
        data: category,
      });
    } catch (error) {
      res.status(getErrorStatus(error.message)).json({
        message: error.message,
      });
    }
  },

  async update(req, res) {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          message: "ID danh mục không hợp lệ.",
        });
      }

      const category = await categoryService.update(id, req.body?.name);

      res.json({
        message: "Cập nhật danh mục thành công.",
        data: category,
      });
    } catch (error) {
      res.status(getErrorStatus(error.message)).json({
        message: error.message,
      });
    }
  },

  async delete(req, res) {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          message: "ID danh mục không hợp lệ.",
        });
      }

      await categoryService.delete(id);

      res.json({
        message: "Xóa danh mục thành công.",
      });
    } catch (error) {
      res.status(getErrorStatus(error.message)).json({
        message: error.message,
      });
    }
  },
};

module.exports = { categoryController };
