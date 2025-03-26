import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// verify token
export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

// admin token
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Access Denied" });
  next();
};

export default { verifyToken, isAdmin };
