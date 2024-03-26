'use strict'
const initialDependencies = require('@root/init')

const limiters = initialDependencies.limiters

exports.rateLimiter = (req, res, next) => {
	const rateLimitType = req.rateLimit && req.rateLimit.type ? req.rateLimit.type : 'general'
	if (rateLimitType == 'none') return next()
	const limiter = limiters[rateLimitType]
	return limiter(req, res, next)
}
