import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel";


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

    const user = await User.findOne({ email });

    if (!user) {
      return response.status(401).json({
        message: "Invalid email or password",
        error: true,
        success: false
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return response.status(401).json({
        message: "Invalid email or password",
        error: true,
        success: false
      });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
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