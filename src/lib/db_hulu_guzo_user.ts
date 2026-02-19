// lib/db.ts
import { Pool } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export async function query(text: string, params: any[] = []) {
  return pool.query(text, params);
}
