import { Request, Response } from "express";
import jwt from "jsonwebtoken";

// Create admin    
const ADMIN = {
  email: "admin@feedpulse.com",
  password: "admin123"
};

export const adminLogin = async (request: Request, response: Response) => {
  try {
    // Get email and password from request body
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({
        message: "Email and Password are required",
        error: true,
        success: false
      });
    }

    if (email !== ADMIN.email || password !== ADMIN.password) {
      return response.status(401).json({
        message: "Invalid Email or Password",
        error: true,
        success: false
      });
    }

    // Create a token for admin user
    const token = jwt.sign(
      { email: ADMIN.email },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1h" }
    );

    return response.status(200).json({
      message: "Admin Login Successful",
      error: false,
      success: true,
      data: { "token":token}
    });
  } catch (error) {
    console.error("Error creating admin user", error);
    return response.status(500).json({
      message: "Internal Server Error",
      error: true,
      success: false
    });
  }
};