import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().default("mongodb://127.0.0.1:27017/forge_lms"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("8h"),
  CLIENT_ORIGIN: z.string().default("http://localhost:3000"),
  ADMIN_EMAIL: z.string().email().default("admin@forgelms.local"),
  ADMIN_PASSWORD: z.string().default("Admin1234!"),
  BCRYPT_ROUNDS: z.coerce.number().default(10),
  LOGIN_RATE_LIMIT_MAX: z.coerce.number().default(10),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
