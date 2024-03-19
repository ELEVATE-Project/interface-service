'use strict'
let table = require('cli-table')
const config = require('@constants/config.json')

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
	PROJECT_SERVICE_BASE_URL: {
		message: 'Required project service base URL',
		optional: false,
	},
	...config.requiredEnvs,
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
