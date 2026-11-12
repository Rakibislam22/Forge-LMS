import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: "admin";
}

declare global {
  namespace Express {
    interface Request {
      admin?: AuthenticatedUser;
    }
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(ApiError.unauthenticated("Authentication token is missing or malformed"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;

    if (!decoded || decoded.role !== "admin") {
      return next(ApiError.forbidden("Access denied: admin privilege required"));
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return next(ApiError.unauthenticated("Token is invalid or expired"));
  }
}
