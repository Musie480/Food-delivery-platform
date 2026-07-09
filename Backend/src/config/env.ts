import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL as string,
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  nodeEnv: process.env.NODE_ENV || "development",
  orsApiKey: process.env.ORS_API_KEY || "",
};
