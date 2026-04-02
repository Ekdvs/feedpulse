import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const adminAuth = (
  request: AuthRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "No token provided",
      });
    }

    
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as { id: string; role: string };

    
    if (decoded.role !== "admin") {
      return response.status(403).json({
        success: false,
        error: true,
        message: "Forbidden - Admin only",
      });
    }

    request.user = decoded;

    next();
  } catch (error) {
    return response.status(401).json({
      success: false,
      error: true,
      message: "Invalid or expired token",
    });
  }
};