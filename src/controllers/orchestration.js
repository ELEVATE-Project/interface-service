'use strict'
const { bodyValueReplacer } = require('@helpers/bodyValueReplacer')

const removeArraySuffix = (obj) => {
	if (Array.isArray(obj)) {
		return obj.map(removeArraySuffix)
	} else if (typeof obj === 'object' && obj !== null) {
		Object.keys(obj).forEach((key) => {
			const newKey = key.endsWith('[]') ? key.slice(0, -2) : key
			obj[newKey] = removeArraySuffix(obj[key])
			if (newKey !== key) {
				delete obj[key]
			}
		})
	}
	return obj
}

const isBadResponse = (statusCode) => statusCode >= 400 && statusCode <= 599

const packageRouterCaller = async (req, res, responses, servicePackage, packages) => {
	const selectedPackage = packages.find((obj) => obj.packageMeta.basePackageName === servicePackage.basePackageName)
	
	if(servicePackage.service){
		req['baseUrl'] = process.env[`${servicePackage.service.toUpperCase()}_SERVICE_BASE_URL`]
	}else {
		req['baseUrl'] = process.env[`${selectedPackage.packageMeta.basePackageName.toUpperCase()}_SERVICE_BASE_URL`]
	}
	if(process.env.DEBUG_MODE == "true"){
		console.log("req['baseUrl']",req['baseUrl']);
	}
	const newBody = bodyValueReplacer(req.body, servicePackage.targetBody)
	req.body = newBody
	req.service = servicePackage.service;
	let responseStatusCode
	if(servicePackage.merge == true && servicePackage.mergeKey != ''){
		responses[servicePackage.mergeKey] = await selectedPackage.packageRouter(req, res, responses);
		responseStatusCode = responses[servicePackage.mergeKey].status
	}else if(servicePackage.service) {
		responses[servicePackage.service] = await selectedPackage.packageRouter(req, res, responses);
		responseStatusCode = responses[servicePackage.service].status
	} else {
		responses[selectedPackage.packageMeta.basePackageName] = await selectedPackage.packageRouter(req, res, responses)
 	    responseStatusCode = responses[selectedPackage.packageMeta.basePackageName].status
	}
	if (isBadResponse(responseStatusCode) && !res.headersSent) {
		if(servicePackage.merge == true && servicePackage.mergeKey != ''){
			res.status(responseStatusCode).send(responses[servicePackage.mergeKey].data)
		}else if(servicePackage.service){
			res.status(responseStatusCode).send(responses[servicePackage.service].data)
		} else {
			res.status(responseStatusCode).send(responses[selectedPackage.packageMeta.basePackageName].data)
		}
		return false
	}
	return true
}
/**
 * Calls a custom merge handler defined in one of the packages based on the provided merge configuration.
 *
 * @async
 * @function
 * @param {Array<Object>} result - An array of response objects from service packages to be merged.
 * @param {Object} mergeOption - The merge configuration object.
 * @param {Object} mergeOption.mergeConfig - Configuration that includes the base package name and the function name to call.
 * @param {string} mergeOption.mergeConfig.basePackageName - Identifier used to find the relevant package.
 * @param {string} mergeOption.mergeConfig.functionName - The name of the custom merge handler function to invoke.
 * @param {Array<Object>} packages - Array of package objects, each expected to have a `packageMeta.basePackageName` and a `customMergeFunctionHandler` function.
 * @returns {Promise<Object>} The result of the custom merge function.
 */
const customMergeFunctionCaller = async (result,mergeOption, packages) => {
	const selectedPackage = packages.find((obj) => obj.packageMeta.basePackageName === mergeOption.basePackageName)
	return selectedPackage.customMergeFunctionHandler(result, mergeOption.functionName, packages)
}

const orchestrationHandler = async (packages, mergeOption ,req, res) => {
	try {
		const { targetPackages, inSequence, responseMessage } = req
		const responses = {}
		let asyncRequestsStatues = []
		if (inSequence)
			for (const servicePackage of targetPackages) {

				const isSuccess = await packageRouterCaller(req, res, responses, servicePackage, packages)

				if (!isSuccess) {
					asyncRequestsStatues.push(false)
					break
				}
			}
		else
			asyncRequestsStatues = await Promise.all(
				targetPackages.map((servicePackage) => {
					return packageRouterCaller(req, res, responses, servicePackage, packages)
				})
			)
		let response = {}
		let responseArray = []
		for (const servicePackage of targetPackages) {
			let body
			if(servicePackage.merge == true && servicePackage.mergeKey != ''){
				body = responses[servicePackage.mergeKey]?.result
			}else if(servicePackage.service){
				body = responses[servicePackage.service]?.result
			} else {
				body = responses[servicePackage.basePackageName]?.result
			}
			response = bodyValueReplacer(response, servicePackage.responseBody)
			responseArray.push(body)
		}

		// Check if custom merge options are provided in the configuration
		if (mergeOption && mergeOption.basePackageName && mergeOption.functionName && mergeOption.packageName) {
			// If all required fields for custom merging exist,
			// call the custom merge function to handle merging logic
			let result = await customMergeFunctionCaller(responseArray,mergeOption, packages)
			response = result
		}else {
			// Fallback to default merging behavior
			for(let resp of responseArray){
				response = { ...response, ...resp }
			}
		}


		if (!asyncRequestsStatues.includes(false))
			res.status(200).send({
				responseCode: 'OK',
				message: responseMessage,
				result: removeArraySuffix(response),
			})
	} catch (err) {
		console.log(err)
		const errorResponse = {
			responseCode: 'INTERNAL_SERVER_ERROR',
			message: 'Internal Server Error',
			error: [],
		}
		res.status(500).json(errorResponse)
	}
}

exports.orchestrationController = {
	orchestrationHandler,
}
