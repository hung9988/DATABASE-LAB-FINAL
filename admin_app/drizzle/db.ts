import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import "dotenv/config";

if (!process.env.DB_URL_ADMIN) {
  throw new Error("DB_URL_ADMIN environment variable is not defined");
}

const db_admin = drizzle(postgres(process.env.DB_URL_ADMIN));

export { db_admin };
