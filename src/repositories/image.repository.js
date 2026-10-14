const prisma = require("../config/database");

class ImageRepository {
  findMany(where, skip, take) {
    return prisma.image.findMany({
      where,
      skip,
      take,
      orderBy: { id: "desc" },
    });
  }

  count(where) {
    return prisma.image.count({ where });
  }

  findById(id) {
    return prisma.image.findUnique({
      where: { id },
    });
  }

  findCategories() {
    return prisma.image.findMany({
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    });
  }

  create(data) {
    return prisma.image.create({ data });
  }

  update(id, data) {
    return prisma.image.update({
      where: { id },
      data,
    });
  }

  delete(id) {
    return prisma.image.delete({
      where: { id },
    });
  }

  async upsertById(id, data) {
    return prisma.image.upsert({
      where: { id },
      create: { id, ...data },
      update: data,
    });
  }
}

module.exports = new ImageRepository();
