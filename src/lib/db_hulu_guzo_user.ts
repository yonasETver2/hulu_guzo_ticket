// lib/db.ts
"use server";

import mysql from "mysql2/promise";

export async function query(sql: string, params: any[] = []) {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "hulu_guzo_user",
  });

  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    await connection.end(); // ensures connection is always closed
  }
}
