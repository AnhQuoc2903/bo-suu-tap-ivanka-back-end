const jwt = require("jsonwebtoken");
const prisma = require("../config/database");

async function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Vui lòng đăng nhập Admin.",
      });
    }

    let payload;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        message: "Token không hợp lệ hoặc đã hết hạn.",
      });
    }

    if (payload.role !== "admin") {
      return res.status(403).json({
        message: "Bạn không có quyền truy cập.",
      });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: Number(payload.sub) },
      select: { id: true, email: true },
    });

    if (!admin) {
      return res.status(401).json({
        message: "Tài khoản Admin không tồn tại.",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireAdmin };
