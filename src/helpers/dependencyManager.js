'use strict'

const dependencyConfigs = require('@configs/dependencyConfig.json')
const requiredEnvsJSON = require('../configs/requiredEnvs.json')

const dependencyManager = () => {
	try {
		const { supportedDependencies, requiredDependencies } = dependencyConfigs
		const supportedDependencyMap = new Map()

		supportedDependencies.map((dependency) => {
			const dependencyPackage = require(dependency.packageName)
			supportedDependencyMap.set(dependency.name, dependencyPackage)
			return dependency.name
		})

		requiredDependencies.map((packageData) => {
			const injectionPackageMap = new Map()

			const unsupportedDependencies = []
			packageData.dependencies.map((dependency) => {
				if (!supportedDependencyMap.has(dependency.name)) unsupportedDependencies.push(dependency.name)
				else injectionPackageMap.set(dependency.name, supportedDependencyMap.get(dependency.name))
			})
			if (unsupportedDependencies.length > 0)
				throw `Package ${packageData.packageName} requires unsupported dependencies: [${unsupportedDependencies}]`
			const { dependencyManager, requiredEnvs } = require(packageData.packageName)
			requiredEnvsJSON.requiredEnvs = {
				...requiredEnvsJSON.requiredEnvs,
				...requiredEnvs,
			}
			const packageEnvironmentVariables = {}
			Object.keys(requiredEnvs).map((envVariable) => {
				packageEnvironmentVariables[envVariable] = process.env[envVariable]
			})

			dependencyManager(injectionPackageMap, packageEnvironmentVariables)
		})
	} catch (error) {
		console.log('Dependency Manager Error: ', error)
		throw error
	}
}

module.exports = dependencyManager
