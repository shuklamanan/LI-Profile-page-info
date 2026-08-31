export const settings = {
  // API Settings
  port: process.env.PORT || 3000,
  apiTitle: "LinkedIn Profile API",
  apiVersion: "1.0.0",
  logLevel: process.env.LOG_LEVEL || "info",

  // LinkedIn Auth (mapped to your .env variable names)
  linkedinSessionCookie: process.env.COOKIE || "",
  linkedinCsrfToken: process.env.CSRF_TOKEN || "",
  linkedinUserAgent:
    process.env.USER_AGENT ||
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",

  // Upstream Settings
  upstreamTimeoutSeconds: parseInt(process.env.UPSTREAM_TIMEOUT_SECONDS || "20", 10),
};
