const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categoryRepository = {
  findAll() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  },

  findById(id) {
    return prisma.category.findUnique({
      where: { id },
    });
  },

  countImagesByCategory(categoryName) {
    return prisma.image.count({
      where: {
        category: categoryName,
      },
    });
  },

  findBySlug(slug) {
    return prisma.category.findUnique({
      where: { slug },
    });
  },

  create(data) {
    return prisma.category.create({
      data,
    });
  },

  update(id, data) {
    return prisma.category.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.category.delete({
      where: { id },
    });
  },
};

module.exports = { categoryRepository };
