import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import * as schema from "./schema";

// Configure WebSocket for local development
if (process.env.NODE_ENV !== "production") {
  neonConfig.webSocketConstructor = (await import("ws")).default;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const pool = new Pool({ connectionString });

export const db = drizzle(pool, { schema });
