'use strict'
const fs = require('fs')
const path = require('path')

const inputFile = '../configs/.config.json'
const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'))

const routes = data.routes

const outputDir = '../constants/routesConfigs'
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir)
}

const packageRoutes = {}
const orchestratedRoutes = []

routes.forEach((route) => {
	if (route.orchestrated) {
		orchestratedRoutes.push(route)
	} else {
		route.targetPackages.forEach((targetPackage) => {
			const packageName = targetPackage.packageName

			if (!packageRoutes[packageName]) {
				packageRoutes[packageName] = []
			}
			packageRoutes[packageName].push(route)
		})
	}
})

const orchestratedFile = path.join(outputDir, 'orchestrated.json')
fs.writeFileSync(orchestratedFile, JSON.stringify({ routes: orchestratedRoutes }, null, 4))

Object.keys(packageRoutes).forEach((packageName) => {
	const packageFile = path.join(outputDir, `${packageName}.json`)
	fs.writeFileSync(packageFile, JSON.stringify({ routes: packageRoutes[packageName] }, null, 4))
})

console.log('Routes have been split and saved successfully.')
