import express from "express";
import cors from "cors";
import authRouter from "./routes/authRouter";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World 🚀");
});

app.use("/api/auth",authRouter);

export default app;