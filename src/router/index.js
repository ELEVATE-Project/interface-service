'use strict'

const { routesConfigs } = require('@root/configs/routesConfigs')
const { orchestrationController } = require('@controllers/orchestration')
const { targetPackagesInjector } = require('@middlewares/targetPackagesInjector')
const { routeConfigInjector } = require('@middlewares/routeConfigInjector')
const { rateLimiter } = require('@middlewares/rateLimiter')
const bodyParser = require('body-parser')
const { httpMethods } = require('@constants/httpMethods')
const { jsonBodyParserWithErrors } = require('@middlewares/jsonBodyParserWithErrors')

const urlencodedParser = bodyParser.urlencoded({ extended: true, limit: '50MB' })

exports.initializeRouter = (packages) => {
	try {
		const express = require('express')
		const router = express.Router()
		const routes = routesConfigs.routes

		routes.forEach((route) => {
			const method = httpMethods[route.type]
			const { sourceRoute, orchestrated, requiresCustomHandling, targetPackages } = route
			const basePackageName = targetPackages[0].basePackageName
			const servicePackage = packages.find((pkg) => pkg.packageMeta.basePackageName === basePackageName)

			if (!servicePackage) throw new Error(`Package with basePackageName ${basePackageName} not found`)

			if (orchestrated)
				router[method](
					sourceRoute,
					targetPackagesInjector,
					rateLimiter,
					urlencodedParser,
					jsonBodyParserWithErrors,
					orchestrationController.orchestrationHandler.bind(null, packages)
				)
			else if (requiresCustomHandling)
				router[method](
					sourceRoute,
					routeConfigInjector,
					rateLimiter,
					urlencodedParser,
					jsonBodyParserWithErrors,
					servicePackage.packageRouter
				)
			else router[method](sourceRoute, routeConfigInjector, rateLimiter, servicePackage.packageRouter)
		})

		return router
	} catch (err) {
		console.error('Error initializing router:', err)
		throw err
	}
}
