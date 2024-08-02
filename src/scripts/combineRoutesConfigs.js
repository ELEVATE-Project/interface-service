'use strict'

const fs = require('fs').promises
const path = require('path')
const { execSync } = require('child_process')

async function combineRoutesAndWriteToFile() {
	const outputDir = './configs/routesConfigs'
	const outputFile = './configs/.config.json'
	let combinedRoutes = []

	try {
		const files = await fs.readdir(outputDir)

		for (const file of files) {
			const filePath = path.join(outputDir, file)
			if (filePath.endsWith('.json')) {
				const fileData = await fs.readFile(filePath, 'utf8')
				const routes = JSON.parse(fileData).routes || []
				combinedRoutes = combinedRoutes.concat(routes)
			}
		}

		await fs.writeFile(outputFile, JSON.stringify({ routes: combinedRoutes }, null, 4))
		console.log('Routes have been combined and written to config.json')
		return 'All routes have been combined into config.json'
	} catch (error) {
		console.error('Error occurred while combining routes:', error)
		throw error
	}
}

function runCombineRoutes() {
	try {
		execSync('node -e "require(\'./scripts/combineRoutesConfigs.js\').combineRoutesAndWriteToFile()"', {
			stdio: 'inherit',
		})
		console.log('Script executed successfully')
	} catch (error) {
		console.error('Error occurred while running the script:', error)
	}
}

module.exports = { combineRoutesAndWriteToFile, runCombineRoutes }

if (require.main === module) combineRoutesAndWriteToFile().catch((error) => console.error(error))
