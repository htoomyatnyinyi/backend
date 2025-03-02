import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("No token found in cookies");
    return res
      .status(401)
      .json({ message: "No token provided, authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Token verified:", decoded); // Debug log
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
};

export { verifyToken, checkRole };
