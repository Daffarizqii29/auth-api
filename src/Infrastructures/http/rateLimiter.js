const parsePositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const createStrictRateLimiter = ({
  windowMs = 60_000,
  maxRequests = 90,
  message = 'Too many requests',
} = {}) => {
  const buckets = new Map();

  return (req, res, next) => {
    const key = req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const existingBucket = buckets.get(key);

    if (!existingBucket || now >= existingBucket.expiresAt) {
      buckets.set(key, {
        count: 1,
        expiresAt: now + windowMs,
      });
      return next();
    }

    if (existingBucket.count >= maxRequests) {
      const retryAfterSeconds = Math.max(1, Math.ceil((existingBucket.expiresAt - now) / 1000));
      res.set('Retry-After', String(retryAfterSeconds));

      return res.status(429).json({
        status: 'fail',
        message,
      });
    }

    existingBucket.count += 1;
    return next();
  };
};

export const strictThreadsRateLimiter = createStrictRateLimiter({
  windowMs: parsePositiveInteger(process.env.THREADS_RATE_LIMIT_WINDOW_MS, 60_000),
  maxRequests: parsePositiveInteger(process.env.THREADS_RATE_LIMIT_MAX_REQUESTS, 90),
  message: 'Too many requests to /threads. Please try again later.',
});

export default createStrictRateLimiter;
