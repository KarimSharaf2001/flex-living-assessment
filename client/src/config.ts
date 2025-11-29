// If we are in production, use the env var. Otherwise, localhost.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";
