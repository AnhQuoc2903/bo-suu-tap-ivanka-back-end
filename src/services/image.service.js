const imageRepository = require("../repositories/image.repository");
const AppError = require("../utils/app-error");
const cloudinary = require("../config/cloudinary");

class ImageService {
  async getImages(query) {
    const search = String(query.search || "").trim();
    const category = String(query.category || "").trim();

    const parsedPage = Number.parseInt(query.page, 10);
    const parsedLimit = Number.parseInt(query.limit, 10);

    const page = Math.max(1, Number.isSafeInteger(parsedPage) ? parsedPage : 1);

    const limit = Math.max(
      1,
      Number.isSafeInteger(parsedLimit) ? parsedLimit : 9,
    );

    if (category && category !== "all") {
      const categories = await imageRepository.findCategories();
      const allowedCategories = categories.map((item) => item.category);

      if (!allowedCategories.includes(category)) {
        throw new AppError("Danh mục không hợp lệ", 400);
      }
    }

    const where = {};

    if (category && category !== "all") {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { label: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    const [data, total] = await Promise.all([
      imageRepository.findMany(where, (page - 1) * limit, limit),
      imageRepository.count(where),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCategories() {
    const result = await imageRepository.findCategories();
    return result.map((item) => item.category);
  }

  async getImageById(id) {
    const image = await imageRepository.findById(id);

    if (!image) {
      throw new AppError("Không tìm thấy ảnh", 404);
    }

    return image;
  }

  toDatabaseData(data) {
    return {
      title: data.title,
      label: data.label,
      category: data.category,
      image: data.image,
      description: data.description,
      date: new Date(`${data.date}T00:00:00.000Z`),
      location: data.location,
      tags: data.tags,
    };
  }

  async createImage(data) {
    return imageRepository.create(this.toDatabaseData(data));
  }

  async updateImage(id, data) {
    await this.getImageById(id);
    return imageRepository.update(id, this.toDatabaseData(data));
  }

  async deleteImage(id) {
    const image = await this.getImageById(id);

    const imageUrl = image.image;
    const cloudinaryPrefix = "res.cloudinary.com/";

    if (imageUrl && imageUrl.includes(cloudinaryPrefix)) {
      const url = new URL(imageUrl);
      const parts = url.pathname.split("/").filter(Boolean);
      const uploadIndex = parts.indexOf("upload");

      if (uploadIndex !== -1) {
        const pathParts = parts.slice(uploadIndex + 1);

        // Bỏ phần version, ví dụ v123456789
        if (pathParts[0] && /^v\d+$/.test(pathParts[0])) {
          pathParts.shift();
        }

        const publicId = pathParts.join("/").replace(/\.[^/.]+$/, "");

        if (publicId.startsWith("ivanka-gallery/")) {
          const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
          });

          if (result.result !== "ok" && result.result !== "not found") {
            throw new AppError("Không thể xóa ảnh trên Cloudinary", 502);
          }
        }
      }
    }

    await imageRepository.delete(id);

    return { message: "Xóa ảnh thành công" };
  }
}

module.exports = new ImageService();
