// lib/db.ts
import mysql from "mysql2/promise";

export async function query(sql: string, params: any[] = []) {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root", // change this
    password: "123456", // change this
    database: "hulunat",
  });

  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    await connection.end(); // always closes connection
  }
}
