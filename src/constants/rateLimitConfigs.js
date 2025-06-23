'use strict'

const standardHandler = (req, res) => {
	res.status(429).json({
		responseCode: 'RATE_LIMITED',
		message: 'Too many requests. Please try again later.',
	})
}

exports.rateLimitConfigs = {
	'public-low': {
		windowMs: parseInt(process.env.RATE_LIMITER_PUBLIC_LOW_WINDOW),
		limit: parseInt(process.env.RATE_LIMITER_PUBLIC_LOW_LIMIT),
		standardHeaders: 'draft-7',
		legacyHeaders: false,
		handler: standardHandler,
	},
	'public-minimum': {
		windowMs: parseInt(process.env.RATE_LIMITER_PUBLIC_MINIMUM_WINDOW),
		limit: parseInt(process.env.RATE_LIMITER_PUBLIC_MINIMUM_LIMIT),
		standardHeaders: 'draft-7',
		legacyHeaders: false,
		handler: standardHandler,
	},
	general: {
		windowMs: parseInt(process.env.RATE_LIMITER_GENERAL_WINDOW),
		limit: parseInt(process.env.RATE_LIMITER_GENERAL_LIMIT),
		standardHeaders: 'draft-7',
		legacyHeaders: false,
		handler: standardHandler,
	},
	internal: {
		windowMs: parseInt(process.env.RATE_LIMITER_INTERNAL_WINDOW),
		limit: parseInt(process.env.RATE_LIMITER_INTERNAL_LIMIT),
		standardHeaders: 'draft-7',
		legacyHeaders: false,
		handler: standardHandler,
		skipSuccessfulRequests: true,
	},
}
