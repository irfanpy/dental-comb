import pg from "pg";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;
let pool = null;
let poolInitError = null;

if (!databaseUrl) {
  poolInitError = new Error("DATABASE_URL is not set");
} else {
  try {
    const poolConfig = {
      connectionString: databaseUrl,
      family: 4,
    };

    const needsSsl = /sslmode=require/i.test(databaseUrl)
      || /supabase\.co/i.test(databaseUrl);

    const allowSelfSigned = String(process.env.DB_SSL_ALLOW_SELF_SIGNED || "true")
      .toLowerCase() === "true";

    if (needsSsl) {
      poolConfig.ssl = { rejectUnauthorized: !allowSelfSigned ? true : false };
    }

    pool = new Pool(poolConfig);
  } catch (err) {
    poolInitError = err;
  }
}

export const query = (text, params) => {
  if (!pool || poolInitError) {
    const err = new Error(
      `Database not configured correctly: ${poolInitError?.message || "Unknown error"}`
    );
    err.status = 500;
    throw err;
  }
  return pool.query(text, params);
};

export default pool;
