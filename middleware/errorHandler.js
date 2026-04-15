export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  if (err.name === "MongoServerError" && err.code === 11000) {
    return res.status(400).json({ error: "Duplicate key error" });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ error: message });
};
