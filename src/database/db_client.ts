import { Pool } from "pg"

let pool: Pool

export function init() {
  pool = new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: Number(process.env.POSTGRES_PORT),
    max: 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2_000,
  })

  pool.on("error", (err) => console.log("Database Error!", err))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function query(text: string, params?: any) {
  return pool.query(text, params)
}

export async function getClient() {
  return pool.connect()
}
