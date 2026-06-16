import { NextFunction, Request, Response } from 'express'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import { RATE_LIMIT } from '../config'

const limiter = new RateLimiterMemory({
    points: RATE_LIMIT.points,
    duration: RATE_LIMIT.duration,
    blockDuration: RATE_LIMIT.blockDuration,
})

const rateLimiter = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!RATE_LIMIT.enabled) {
        return next()
    }

    try {
        await limiter.consume(req.ip || 'unknown')
        return next()
    } catch {
        return res.status(429).json({ message: 'Слишком много запросов' })
    }
}

export default rateLimiter
