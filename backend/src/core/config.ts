import dotenv from 'dotenv';

// Attempt loading .env from current directory, backend directory, or monorepo paths
dotenv.config();
export const settings = {
  port: process.env.PORT || 3000,
  linkedinSessionCookie: process.env.COOKIE || "",
  linkedinCsrfToken: process.env.CSRF_TOKEN || "",
  linkedinUserAgent:
    process.env.USER_AGENT ||
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
};
