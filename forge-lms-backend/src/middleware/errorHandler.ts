import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_ID",
        message: "Invalid resource identifier",
      },
    });
  }

  // Log unexpected errors
  console.error("💥 Unhandled Error:", err);

  const message =
    env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error";

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message,
    },
  });
}
