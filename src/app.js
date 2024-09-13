'use strict'
require('module-alias/register')
const express = require('express')
const cors = require('cors')
require('dotenv').config({ path: './.env' })
const packageInstaller = require('./utils/packageInstaller')

packageInstaller(process.env.REQUIRED_PACKAGES).catch((error) => {
	console.error(`An error occurred in package installer: ${error}`)
	process.exit()
})

const { runCombineRoutes } = require('./scripts/combineRoutesConfigs')
runCombineRoutes()

const dependencyManager = require('@helpers/dependencyManager')
dependencyManager()

let environmentData = require('./envVariables')()
if (!environmentData.success) {
	console.error('Server could not start . Not all environment variable is provided')
	process.exit()
}
require('./init')

const app = express()
const path = require('path')
app.set('trust proxy', parseInt(process.env.RATE_LIMITER_NUMBER_OF_PROXIES))

//Package Loader & Validation
const routerPackages = require('@utils/packageLoader').packageLoader()
//const validatedPackages = packageValidator(routerPackages);
const validatedPackages = routerPackages //Bypassing the validator for now

app.use(cors())
// Middleware to set Access-Control-Allow-Origin header
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_HOST)
	next()
})

const { initializeRouter } = require('@router')
app.use(initializeRouter(validatedPackages))
app.get(process.env.API_DOC_URL, function (req, res) {
	res.sendFile(path.join(__dirname, './api-doc/index.html'))
})

app.listen(process.env.APPLICATION_PORT, (res, err) => {
	if (err) {
		onError(err)
	}
	console.log('Environment: ' + process.env.APPLICATION_ENV)
	console.log('Application is running on the port:' + process.env.APPLICATION_PORT)
})
