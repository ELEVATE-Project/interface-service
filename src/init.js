'use strict'
const { rateLimitConfigs } = require('@constants/rateLimitConfigs')
const { default: rateLimit } = require('express-rate-limit')

const initializeRateLimiters = () => {
	try {
		const limiters = {}
		Object.keys(rateLimitConfigs).map((type) => (limiters[type] = rateLimit(rateLimitConfigs[type])))
		return limiters
	} catch (error) {
		console.log(error)
	}
}

const limiters = initializeRateLimiters()
module.exports = { limiters }
