'use strict'

const standardHandler = (req, res) => {
	res.status(429).json({
		responseCode: 'RATE_LIMITED',
		message: 'Too many requests. Please try again later.',
	})
}

exports.rateLimitConfigs = {
	'public-low': {
		windowMs: process.env.RATE_LIMITER_PUBLIC_LOW_WINDOW,
		limit: process.env.RATE_LIMITER_PUBLIC_LOW_LIMIT,
		standardHeaders: false,
		legacyHeaders: false,
		handler: standardHandler,
	},
	general: {
		windowMs: process.env.RATE_LIMITER_GENERAL_WINDOW,
		limit: process.env.RATE_LIMITER_GENERAL_LIMIT,
		standardHeaders: false,
		legacyHeaders: false,
		handler: standardHandler,
	},
	internal: {
		windowMs: process.env.RATE_LIMITER_INTERNAL_WINDOW,
		limit: process.env.RATE_LIMITER_INTERNAL_LIMIT,
		standardHeaders: false,
		legacyHeaders: false,
		handler: standardHandler,
		skipSuccessfulRequests: true,
	},
}
