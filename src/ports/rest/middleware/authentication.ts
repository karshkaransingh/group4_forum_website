import jwt from "jsonwebtoken";
import config from "../../../config/config";

// function to generate access token
export const generateAccessToken = (user: any) => {
  return jwt.sign(
    {
      userName: user.userName,
      userId: user._id.toString(),
      isAdmin: user.isAdmin || false,
      role: user.role || "user",
    },
    config.jwtSecret,
    { expiresIn: "10m" },
  );
};

// function to generate refresh token
export const generateRefreshToken = (user: any) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
    },
    config.jwtSecret,
  );
};

// function to authenticate the token
export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader: string | undefined = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid token",
      });
    }

    req.user = user;
    next();
  });
};

// function to give access to admins only
export const authorizeAdmin = (req: any, res: any, next: any) => {
  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({
      message: "Admin access only",
    });
  }

  next();
};
