import express from "express";
import cors from "cors";
import router from "./domains/app.controller";
import './domains/short-video/short.listener';
export const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});
