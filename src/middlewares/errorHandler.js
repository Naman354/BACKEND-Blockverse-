export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
};
