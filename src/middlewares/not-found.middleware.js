function notFound(req, res) {
  res.status(404).json({
    message: `Không tìm thấy endpoint ${req.method} ${req.originalUrl}`,
  });
}

module.exports = notFound;
