'use strict'
/* const transformRecursive = (source, targetConfig, output) => {
	for (const [key, value] of Object.entries(targetConfig)) {
		if (typeof value === 'object') transformRecursive(source, value, output[key])
		else {
			const sourceKey = value.split('.').reduce((obj, key) => obj[key], source)
			output[key] = sourceKey !== undefined ? sourceKey : source[value]
			delete output[value]
		}
	}
} */

const accessNestedField = (obj, path) => {
	const keys = path.split('.')
	let value = obj
	let parent = null
	for (const key of keys) {
		parent = value
		value = value[key]
		if (value === undefined) return undefined
	}
	if (parent !== null) delete parent[keys[keys.length - 1]]
	return value
}

const setNestedField = (obj, path, value) => {
	const keys = path.split('.')
	let currentObj = obj

	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i]
		currentObj[key] = currentObj[key] || {}
		currentObj = currentObj[key]
	}
	const finalKey = keys[keys.length - 1]
	currentObj[finalKey] = finalKey.endsWith('[]') ? (currentObj[finalKey] || []).concat(value) : value
}

const isObject = (obj) => typeof obj === 'object' && obj !== null && !Array.isArray(obj)

const transformRecursive = (source, sourceFieldMap, currentPath, result) => {
	if (isObject(source))
		for (const [key, value] of Object.entries(source)) {
			if (isObject(value)) {
				const path = currentPath + key + '.'
				transformRecursive(source[key], sourceFieldMap, path, result)
			} else {
				const keyPath = currentPath + key
				if (sourceFieldMap.has(keyPath)) {
					const targetField = sourceFieldMap.get(keyPath)
					setNestedField(result, targetField, accessNestedField(result, keyPath))
				}
			}
		}
}

const sourceFieldMapGenerator = (mappings) => {
	const sourceFieldMap = new Map()
	mappings.map((mapping) => {
		sourceFieldMap.set(mapping.sourceField, mapping.targetField)
	})
	return sourceFieldMap
}

exports.bodyValueReplacer = (sourceObject, targetObjectConfig) => {
	const sourceFieldMap = sourceFieldMapGenerator(targetObjectConfig)
	const result = JSON.parse(JSON.stringify(sourceObject))
	transformRecursive(sourceObject, sourceFieldMap, '', result, '\t')
	return result
}
