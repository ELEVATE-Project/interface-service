'use strict'
let table = require('cli-table')
const requiredEnvs = require('@configs/requiredEnvs.json')

let tableData = new table()
let environmentVariables = {
	APPLICATION_PORT: {
		message: 'Required port no',
		optional: false,
	},
	APPLICATION_ENV: {
		message: 'Required node environment',
		optional: false,
	},
	REQUIRED_PACKAGES: {
		message: 'Required REQUIRED_PACKAGES',
		optional: false,
	},
	SUPPORTED_HTTP_TYPES: {
		message: 'Required supported HTTP types',
		optional: false,
	},
	SCHEDULER_SERVICE_BASE_URL: {
		message: 'Required scheduler service base URL',
		optional: false,
	},
	NOTIFICATION_SERVICE_BASE_URL: {
		message: 'Required notification service base URL',
		optional: false,
	},
	RATE_LIMITER_PUBLIC_LOW_WINDOW: {
		message: 'Required window duration for public-low type',
		optional: true,
		default: 2 * 60 * 1000,
	},
	RATE_LIMITER_PUBLIC_LOW_LIMIT: {
		message: 'Required limit for public-low type',
		optional: true,
		default: 5,
	},
	RATE_LIMITER_GENERAL_WINDOW: {
		message: 'Required window duration for general type',
		optional: true,
		default: 1 * 60 * 1000,
	},
	RATE_LIMITER_GENERAL_LIMIT: {
		message: 'Required limit for general type',
		optional: true,
		default: 50,
	},
	RATE_LIMITER_INTERNAL_WINDOW: {
		message: 'Required window duration for internal type',
		optional: true,
		default: 1 * 60 * 1000,
	},
	RATE_LIMITER_INTERNAL_LIMIT: {
		message: 'Required limit for internal type',
		optional: true,
		default: 50,
	},
	RATE_LIMITER_NUMBER_OF_PROXIES: {
		message: 'Required number of proxies',
		optional: false,
	},
	RATE_LIMITER_ENABLED: {
		message: 'Required global rate limiter enabled flag',
		optional: false,
	},
	ALLOWED_HOST: {
		message: 'Required CORS allowed host',
		optional: true,
		default: '*',
	},
	...requiredEnvs.requiredEnvs,
}

let success = true
module.exports = function () {
	Object.keys(environmentVariables).forEach((eachEnvironmentVariable) => {
		let tableObj = {
			[eachEnvironmentVariable]: 'PASSED',
		}

		let keyCheckPass = true

		if (
			environmentVariables[eachEnvironmentVariable].optional === true &&
			environmentVariables[eachEnvironmentVariable].requiredIf &&
			environmentVariables[eachEnvironmentVariable].requiredIf.key &&
			environmentVariables[eachEnvironmentVariable].requiredIf.key != '' &&
			environmentVariables[eachEnvironmentVariable].requiredIf.operator &&
			validRequiredIfOperators.includes(environmentVariables[eachEnvironmentVariable].requiredIf.operator) &&
			environmentVariables[eachEnvironmentVariable].requiredIf.value &&
			environmentVariables[eachEnvironmentVariable].requiredIf.value != ''
		) {
			switch (environmentVariables[eachEnvironmentVariable].requiredIf.operator) {
				case 'EQUALS':
					if (
						process.env[environmentVariables[eachEnvironmentVariable].requiredIf.key] ===
						environmentVariables[eachEnvironmentVariable].requiredIf.value
					) {
						environmentVariables[eachEnvironmentVariable].optional = false
					}
					break
				case 'NOT_EQUALS':
					if (
						process.env[environmentVariables[eachEnvironmentVariable].requiredIf.key] !=
						environmentVariables[eachEnvironmentVariable].requiredIf.value
					) {
						environmentVariables[eachEnvironmentVariable].optional = false
					}
					break
				default:
					break
			}
		}

		if (environmentVariables[eachEnvironmentVariable].optional === false) {
			if (!process.env[eachEnvironmentVariable] || process.env[eachEnvironmentVariable] == '') {
				success = false
				keyCheckPass = false
			} else if (
				environmentVariables[eachEnvironmentVariable].possibleValues &&
				Array.isArray(environmentVariables[eachEnvironmentVariable].possibleValues) &&
				environmentVariables[eachEnvironmentVariable].possibleValues.length > 0
			) {
				if (
					!environmentVariables[eachEnvironmentVariable].possibleValues.includes(
						process.env[eachEnvironmentVariable]
					)
				) {
					success = false
					keyCheckPass = false
					environmentVariables[eachEnvironmentVariable].message += ` Valid values - ${environmentVariables[
						eachEnvironmentVariable
					].possibleValues.join(', ')}`
				}
			}
		}

		if (
			(!process.env[eachEnvironmentVariable] || process.env[eachEnvironmentVariable] == '') &&
			environmentVariables[eachEnvironmentVariable].default &&
			environmentVariables[eachEnvironmentVariable].default != ''
		) {
			process.env[eachEnvironmentVariable] = environmentVariables[eachEnvironmentVariable].default
		}

		if (!keyCheckPass) {
			if (environmentVariables[eachEnvironmentVariable].message !== '') {
				tableObj[eachEnvironmentVariable] = environmentVariables[eachEnvironmentVariable].message
			} else {
				tableObj[eachEnvironmentVariable] = `FAILED - ${eachEnvironmentVariable} is required`
			}
		}

		tableData.push(tableObj)
	})

	console.log(tableData.toString())

	return {
		success: success,
	}
}
