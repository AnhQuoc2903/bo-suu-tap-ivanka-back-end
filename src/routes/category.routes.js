const express = require("express");
const { categoryController } = require("../controllers/category.controller");
const { requireAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// Lấy danh sách danh mục
router.get("/", categoryController.getAll);

// Các thao tác thay đổi dữ liệu yêu cầu quyền admin
router.post("/", requireAdmin, categoryController.create);
router.put("/:id", requireAdmin, categoryController.update);
router.delete("/:id", requireAdmin, categoryController.delete);

module.exports = router;
