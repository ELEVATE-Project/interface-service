'use strict'
const bodyParser = require('body-parser')

exports.jsonBodyParserWithErrors = (req, res, next) => {
	bodyParser.json({ limit: '50MB' })(req, res, (err) => {
		if (err instanceof SyntaxError || (err && err.type === 'entity.parse.failed')) {
			res.status(400).json({
				responseCode: 'INVALID_JSON', // response code and message can be customized here
				message: 'The JSON provided in the request is invalid or malformed.',
			})
		} else {
			next(err)
		}
	})
}
