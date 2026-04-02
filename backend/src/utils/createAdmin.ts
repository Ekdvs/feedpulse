import bcrypt from "bcrypt";
import User from "../models/userModel";

export const createAdmin = async () => {
  const exists = await User.findOne({ email: "admin@feedpulse.com" });

  if (!exists) {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      email: "admin@feedpulse.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created");
  }
};