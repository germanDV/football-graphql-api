import Redis from "ioredis"

let client: Redis

function init() {
  client = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  })
}

/**
 * Get a redis client.
 * If no connection has been established, it establishes it.
 */
export function getRedis() {
  if (!client) init()
  return client
}
