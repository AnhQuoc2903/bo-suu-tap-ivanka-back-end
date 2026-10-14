const { z } = require("zod");

const imageSchema = z.object({
  title: z.string().trim().min(1).max(255),
  label: z.string().trim().min(1).max(100),
  category: z.string().trim().min(1, "Vui lòng chọn danh mục").max(100),
  image: z
    .string()
    .url()
    .refine(
      (value) => ["http:", "https:"].includes(new URL(value).protocol),
      "URL ảnh phải dùng HTTP hoặc HTTPS",
    ),
  description: z.string().trim().min(1),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((value) => {
      const date = new Date(`${value}T00:00:00.000Z`);

      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
      );
    }, "Ngày phải đúng định dạng YYYY-MM-DD"),
  location: z.string().trim().min(1).max(255),
  tags: z.array(z.string().trim().min(1)).default([]),
});

module.exports = { imageSchema };
