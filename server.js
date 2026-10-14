require("dotenv").config();

const app = require("./src/app");
const prisma = require("./src/config/database");

const PORT = process.env.PORT || 5000;

async function startServer() {
  await prisma.$connect();

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  let shuttingDown = false;

  async function shutdown() {
    if (shuttingDown) return;
    shuttingDown = true;

    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  }

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

startServer().catch(async (error) => {
  console.error("Không thể khởi động server:", error);
  await prisma.$disconnect();
  process.exit(1);
});
