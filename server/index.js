import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import authRoute from "./routes/AuthRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8088;
const databaseUrl = process.env.DATABASE_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads/profiles/", express.static("uploads/profiles"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);

const server = app.listen(port, () =>
  console.log(`Server is running at  http://localhost:${port}`)
);

mongoose
  .connect(databaseUrl)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err.message));
