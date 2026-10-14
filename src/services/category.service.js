const { categoryRepository } = require("../repositories/category.repository");

function createSlug(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const categoryService = {
  getAll() {
    return categoryRepository.findAll();
  },

  async create(name) {
    const trimmedName = name?.trim();

    if (!trimmedName) {
      throw new Error("Vui lòng nhập tên danh mục.");
    }

    const slug = createSlug(trimmedName);

    if (!slug) {
      throw new Error("Tên danh mục không hợp lệ.");
    }

    const existing = await categoryRepository.findBySlug(slug);

    if (existing) {
      throw new Error("Danh mục này đã tồn tại.");
    }

    return categoryRepository.create({
      name: trimmedName,
      slug,
    });
  },

  async update(id, name) {
    const trimmedName = name?.trim();

    if (!trimmedName) {
      throw new Error("Vui lòng nhập tên danh mục.");
    }

    const slug = createSlug(trimmedName);

    if (!slug) {
      throw new Error("Tên danh mục không hợp lệ.");
    }

    const existing = await categoryRepository.findBySlug(slug);

    if (existing && existing.id !== id) {
      throw new Error("Tên danh mục này đã được sử dụng.");
    }

    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new Error("Không tìm thấy danh mục.");
    }

    return categoryRepository.update(id, {
      name: trimmedName,
      slug,
    });
  },

  async delete(id) {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new Error("Không tìm thấy danh mục.");
    }

    const imageCount = await categoryRepository.countImagesByCategory(
      category.slug,
    );

    if (imageCount > 0) {
      throw new Error(
        "Không thể xóa danh mục đang có ảnh. Hãy chuyển ảnh sang danh mục khác trước.",
      );
    }

    return categoryRepository.delete(id);
  },
};

module.exports = { categoryService };
