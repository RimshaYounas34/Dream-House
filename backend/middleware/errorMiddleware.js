export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  console.error(error);
  if (res.headersSent) return next(error);

  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: "A record with that value already exists" });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ success: false, message: Object.values(error.errors).map((item) => item.message).join(", ") });
  }

  res.status(error.statusCode || 500).json({ success: false, message: error.expose ? error.message : "Unexpected server error" });
}
