import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

interface ParsedRequest {
  body?: unknown;
  query?: unknown;
  params?: unknown;
}

export const validate = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as ParsedRequest;

      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query as Request["query"];
      if (parsed.params) req.params = parsed.params as Request["params"];

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((err) => ({
          field: err.path.slice(1).join(".") || err.path[0]?.toString() || "field",
          message: err.message,
        }));
        return next(ApiError.badRequest("Validation failed", details));
      }
      next(error);
    }
  };
};
