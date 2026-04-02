import express from "express";
import morgan from "morgan";
import cors from "cors";
import { errorHandler } from "@/middlewares/errorHandler.js";
import { notFoundHandler } from "@/middlewares/notFoundHandler.js";

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
      service: "Central Bank API",
      timestamp: new Date().toISOString(),
    });
  });

  // Error Handler
  app.use(errorHandler);
  app.use(notFoundHandler);
  return app;
};
