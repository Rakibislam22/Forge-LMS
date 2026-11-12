import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { respondSuccess } from "../utils/respond.js";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) {
    throw ApiError.unauthenticated("Incorrect email or password");
  }

  const isValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isValid) {
    throw ApiError.unauthenticated("Incorrect email or password");
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return respondSuccess(res, {
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
  });
}

export async function getMe(req: Request, res: Response) {
  if (!req.admin) {
    throw ApiError.unauthenticated();
  }

  return respondSuccess(res, {
    admin: req.admin,
  });
}
