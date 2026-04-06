import express from "express";
import morgan from "morgan";
import cors from "cors";
import { errorHandler } from "@/middlewares/errorHandler.js";
import { notFoundHandler } from "@/middlewares/notFoundHandler.js";
import { logRouter } from "./routes/v1/log/log.route.js";

export const initializeApp = () => {
  const app = express();
  // Config cors
  app.use(cors());
  // Body parser middleware
  app.use(express.json());
  // HTTP request logger middleware
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms"),
  ); // Log to console

  // Healthy check endpoint
  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "OK",
      service: "Malicious Server API",
      timestamp: new Date().toISOString(),
    });
  });

  // Routes
  app.use("/log", logRouter);
  // Error Handler
  app.use(errorHandler);
  app.use(notFoundHandler);
  return app;
};
