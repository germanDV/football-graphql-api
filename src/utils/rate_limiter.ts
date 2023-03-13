import { MiddlewareFn } from "type-graphql"
import { getRedis } from "./redis"

export function rateLimiter(key: string, reqsPerMin: number): MiddlewareFn {
  return async (_, next) => {
    const redis = getRedis()
    const current = await redis.incr(key)

    if (current > reqsPerMin) {
      throw new Error("too many requests")
    } else if (current === 1) {
      // Expire the key in 1 minute.
      await redis.expire(key, 60)
    }

    return next()
  }
}
