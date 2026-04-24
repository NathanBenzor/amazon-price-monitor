import dotenv from "dotenv";

dotenv.config();

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: Number(getEnv("PORT", "4000")),
};
