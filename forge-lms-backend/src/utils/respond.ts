import { Response } from "express";

export function respondSuccess<T>(res: Response, data: T, statusCode: number = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}
