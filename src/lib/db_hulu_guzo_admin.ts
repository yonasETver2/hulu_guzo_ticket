// lib/db.ts
"use server";

import mysql from "mysql2/promise";

export async function query(sql: string, params: any[] = []) {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root", // change to your MySQL username
    password: "123456", // change to your MySQL password
    database: "hulu_guzo",
  });

  const [results] = await connection.execute(sql, params);
  connection.end();
  return results;
}
