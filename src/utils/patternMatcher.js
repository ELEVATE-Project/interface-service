'use strict'

const removeTrailingSlash = (value) => {
	if (typeof value !== 'string') return value
	const trimmedValue = value.trim()
	const normalizedValue = trimmedValue.replace(/[^A-Za-z0-9._~-]+$/g, '')
	return normalizedValue || '/'
}

exports.matchPathsAndExtractParams = (pattern, url) => {
	const normalizedUrl = removeTrailingSlash(url)
	if (typeof normalizedUrl !== 'string') return false
	const [pathOnly] = normalizedUrl.split('?')
	const paramNames = []
	const regexPattern = new RegExp(
		pattern.replace(/\/:(\w+)/g, (_, paramName) => {
			paramNames.push(paramName)
			return '/([^/]+)'
		}) + '$'
	)
	const matchResult = pathOnly.match(regexPattern)
	if (!matchResult) {
		return false
	}
	const params = {}
	for (let i = 0; i < paramNames.length; i++) {
		params[paramNames[i]] = matchResult[i + 1]
	}
	return params
}