import mysql from "mysql2/promise";

/**
 * Global pool for MySQL connections in Next.js
 * Prevents multiple connections during hot-reloading in development
 */
declare global {
  // eslint-disable-next-line no-var
  var mysqlPool: mysql.Pool | undefined;
}

let pool: mysql.Pool | undefined;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    if (process.env.NODE_ENV === "production") {
      pool = mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "marjad_db",
        port: Number(process.env.DB_PORT) || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    } else {
      if (!global.mysqlPool) {
        global.mysqlPool = mysql.createPool({
          host: process.env.DB_HOST || "localhost",
          user: process.env.DB_USER || "root",
          password: process.env.DB_PASSWORD || "",
          database: process.env.DB_NAME || "marjad_db",
          port: Number(process.env.DB_PORT) || 3306,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
        });
      }
      pool = global.mysqlPool;
    }
  }

  return pool;
}

/**
 * Safe query runner for MySQL
 */
export async function query<T = unknown>(sql: string, values?: unknown[]): Promise<T> {
  try {
    const db = getDbPool();
    const [results] = await db.query(sql, values);
    return results as T;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}
