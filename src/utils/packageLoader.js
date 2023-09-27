'use strict'
const packageLoader = () => {
	const packageNames = process.env.REQUIRED_PACKAGES.split(' ')
	const packages = []
	for (const servicePackage of packageNames) {
		const [packageName, version] = servicePackage.split('@')
		packages.push(require(packageName))
	}
	console.log(packages)
	return packages
}

module.exports = { packageLoader }
