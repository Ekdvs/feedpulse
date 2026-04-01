import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  email: string;
}

export const adminAuth = (request: any, response: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return response.status(401).json({
        message: "Unauthorized, no token provided",
        error: true,
        success: false
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;

    // Only admin email allowed
    if (decoded.email !== "admin@feedpulse.com") {
      return response.status(401).json({
        message: "Unauthorized, invalid admin",
        error: true,
        success: false
      });
    }

    // Attach admin info to request (optional)
    request.user = { email: decoded.email };

    next();
  } catch (error: any) {
    console.log(error.message);
    return response.status(401).json({
      message: "Unauthorized, invalid token",
      error: true,
      success: false
    });
  }
};