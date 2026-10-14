require("dotenv").config();

const bcrypt = require("bcryptjs");
const prisma = require("../src/config/database");

async function main() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";

  if (!email || !password) {
    throw new Error(
      "Vui lòng cấu hình ADMIN_EMAIL và ADMIN_PASSWORD trong file .env",
    );
  }

  if (password.length < 12) {
    throw new Error("Mật khẩu Admin phải có ít nhất 12 ký tự.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
    },
  });

  console.log("Tạo tài khoản Admin thành công!");
  console.log("Email:", admin.email);
}

main()
  .catch((error) => {
    console.error("Không thể tạo tài khoản Admin:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
