const { Prisma } = require("@prisma/client");

function errorHandler(error, req, res, next) {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  if (error.statusCode && error.isOperational) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      message: "JSON gửi lên không hợp lệ",
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Không tìm thấy bản ghi",
      });
    }
  }

  res.status(500).json({
    message: "Lỗi máy chủ",
  });
}

module.exports = errorHandler;
