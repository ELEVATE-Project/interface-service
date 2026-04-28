'use strict'
const { routesConfigs } = require('@root/configs/routesConfigs')
const { matchPathsAndExtractParams } = require('@utils/patternMatcher')

exports.targetPackagesInjector = (req, res, next) => {

	const baseURL = req.protocol + '://' + req.headers.host + '/'
	const parsedUrl = new URL(req.originalUrl, baseURL)
	const urlWithoutQuery = parsedUrl.pathname
	const routeConfig = routesConfigs.routes.find((route) =>
		matchPathsAndExtractParams(route.sourceRoute, urlWithoutQuery)
	)

	// const routeConfig = routesConfigs.routes.find((route) => route.sourceRoute === req.originalUrl)
	
	req['targetPackages'] = routeConfig.targetPackages
	req['inSequence'] = routeConfig.inSequence
	req['sourceRoute'] = routeConfig.sourceRoute
	req['orchestrated'] = routeConfig.orchestrated
	req['responseMessage'] = routeConfig.responseMessage
	req['rateLimit'] = routeConfig.rateLimit
	req['requiresCustomHandling'] = routeConfig.requiresCustomHandling || false
	next()
}
