import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const DATABASE_URL = process.env.DATABASE_URL;
export const CORS_ORIGIN = process.env.CORS_ORIGIN;
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;
export const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const EMAIL_FROM = process.env.EMAIL_FROM;
export const LOG_LEVEL = process.env.LOG_LEVEL;
export const NODE_ENV = process.env.NODE_ENV;
export const MAX_LIMIT = Number(process.env.MAX_LIMIT || "100");
export const DEFAULT_LIMIT = Number(process.env.DEFAULT_LIMIT || "10");
export const DEFAULT_PAGE = Number(process.env.DEFAULT_PAGE || 1);
