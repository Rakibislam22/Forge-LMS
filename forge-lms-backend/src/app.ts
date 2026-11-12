import express, { Express } from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

export function createApp(): Express {
  const app = express();

  // CORS configuration (supports localhost, configured origins, and Vercel domains)
  const allowedOrigins = env.CLIENT_ORIGIN.split(",").map((o) => o.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (
          !origin ||
          allowedOrigins.includes(origin) ||
          allowedOrigins.includes("*") ||
          (env.NODE_ENV === "development" && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) ||
          /^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(origin)
        ) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      },
      credentials: true,
    })
  );

  // Body parser with 1MB limit
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // Auto-connect to database on every request (essential for serverless lambdas)
  app.use(async (_req, _res, next) => {
    try {
      await connectDB();
      next();
    } catch (err) {
      next(err);
    }
  });

  // Root health check endpoint
  app.get("/", (_req, res) => {
    res.json({
      success: true,
      message: "Forge LMS Backend API is running",
      timestamp: new Date().toISOString(),
    });
  });

  // API router - mounted at both /api and root / for flexible deployment routing
  app.use("/api", routes);
  app.use("/", routes);

  // 404 Handler
  app.use(notFound);

  // Error Handler
  app.use(errorHandler);

  return app;
}
