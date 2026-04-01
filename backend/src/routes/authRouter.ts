import express from "express";
import { adminLogin } from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/login",adminLogin )


export default authRouter;