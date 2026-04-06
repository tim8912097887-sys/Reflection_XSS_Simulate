import express from "express";
import morgan from "morgan";
import cors from "cors";
import MongoStore from "connect-mongo";
import { errorHandler } from "@/middlewares/errorHandler.js";
import { notFoundHandler } from "@/middlewares/notFoundHandler.js";
import { authRouter } from "./routes/v1/auth/auth.route.js";
import session from "express-session";
import { env } from "./configs/env.js";
import mongoose from "mongoose";
import { reflectInputRouter } from "./routes/v1/reflectInput/reflectInput.route.js";

export const initializeApp = (mongoConnection: mongoose.Mongoose) => {
  const app = express();
  // Config cors
  app.use(cors());
  // Body parser middleware
  app.use(express.json());
  // Session Store
  const SessionStore = MongoStore.create({
    client: mongoConnection.connection.getClient(),
    collectionName: "sessions",
    ttl: env.SESSION_MAX_AGE / 1000, // Session expiration time in seconds
  });
  // Session middleware
  app.use(
    session({
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: env.SESSION_MAX_AGE,
        httpOnly: false,
      },
      store: SessionStore,
    }),
  );
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

  // Routes
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/reflect", reflectInputRouter);
  // Error Handler
  app.use(errorHandler);
  app.use(notFoundHandler);
  return app;
};
