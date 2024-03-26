'use strict'
const { routesConfigs } = require('@constants/routesConfigs')

exports.targetPackagesInjector = (req, res, next) => {
	const routeConfig = routesConfigs.routes.find((route) => route.sourceRoute === req.originalUrl)
	req['targetPackages'] = routeConfig.targetPackages
	req['inSequence'] = routeConfig.inSequence
	req['sourceRoute'] = routeConfig.sourceRoute
	req['orchestrated'] = routeConfig.orchestrated
	req['responseMessage'] = routeConfig.responseMessage
	req['rateLimit'] = routeConfig.rateLimit
	next()
}
