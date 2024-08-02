'use strict'
const { routesConfigs } = require('@root/configs/routesConfigs')
const { matchPathsAndExtractParams } = require('@utils/patternMatcher')

exports.routeConfigInjector = (req, res, next) => {
	const baseURL = req.protocol + '://' + req.headers.host + '/'
	const parsedUrl = new URL(req.originalUrl, baseURL)
	const urlWithoutQuery = parsedUrl.pathname
	const routeConfig = routesConfigs.routes.find((route) =>
		matchPathsAndExtractParams(route.sourceRoute, urlWithoutQuery)
	)
	req['baseUrl'] = process.env[`${routeConfig.targetPackages[0].basePackageName.toUpperCase()}_SERVICE_BASE_URL`]
	req['type'] = routeConfig.type
	req['inSequence'] = routeConfig.inSequence
	req['orchestrated'] = routeConfig.orchestrated
	req['sourceRoute'] = routeConfig.sourceRoute
	req['rateLimit'] = routeConfig.rateLimit
	req['requiresCustomHandling'] = routeConfig.requiresCustomHandling || false
	next()
}
