// lib/db.ts
"use server";

import { Pool } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL3!,
  ssl: {
    rejectUnauthorized: false, // required for Neon
  },
});

export async function query(sql: string, params: any[] = []) {
  return pool.query(sql, params);
}
