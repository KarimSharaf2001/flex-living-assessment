// If we are in Production (Vercel), use an empty string (relative path).
// If we are in Development (Local), use your local backend URL.
export const API_BASE_URL = import.meta.env.PROD ? "" : "http://localhost:3001";
