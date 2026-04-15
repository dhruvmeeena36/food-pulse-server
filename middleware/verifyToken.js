import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // First try to verify as our JWT
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        _id: decoded._id,
        email: decoded.email,
      };
      return next();
    } catch (jwtError) {
      // Not our JWT, try Firebase
      const decoded = jwt.decode(token, { complete: true });
      
      if (!decoded) {
        return res.status(401).json({ error: "Invalid token format" });
      }

      req.user = {
        _id: decoded.payload.user_id || decoded.payload.sub,
        email: decoded.payload.email,
      };
      return next();
    }
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({ error: "Token verification failed" });
  }
};
