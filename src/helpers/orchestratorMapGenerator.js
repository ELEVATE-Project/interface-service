'use strict'
const { bodyConfigGenerator } = require('./bodyConfigGenerator')

exports.orchestratorMapGenerator = (orchestratedRoutesArray) => {
	try {
		const routesMap = new Map()
		for (const routeInfo of orchestratedRoutesArray) {
			if (!routesMap.has(routeInfo.type)) routesMap.set(routeInfo.type, {})
			const routeOrchestrationConfig = routesMap.get(routeInfo.type)
			routeOrchestrationConfig[`${routeInfo.sourceRoute}`] = routeInfo.targetRoutes.map((targetRouteInfo) => {
				return {
					route: targetRouteInfo.route,
					type: targetRouteInfo.type,
					bodyConfig: bodyConfigGenerator(targetRouteInfo.targetBody, targetRouteInfo.processors),
				}
			})
		}
		return routesMap
	} catch (err) {
		console.log(err)
	}
}

/* {
	GET: {
		ROUTE: [
			{
				route: 'baseURL+/basePackageName/route',
				type: 'GET',
				bodyConfig: {
					profile: 'profile',
					name: 'profile.name',
					designation: 'profile.designation',
					additional: {
						[_type]: 'object',
						name: 'profile.name',
						designation: 'profile.designation',
					},
					nameDesignation: {
						[_type]: 'processor',
						input1: 'profile.name',
						input2: 'profile.designation',
						processor: (name, designation) => {
							return `${name} - ${designation}`;
						},
					},
					'profile.nameDesignation2': {
						input1: 'profile.name',
						input2: 'profile.designation',
						processor: (name, designation) => {
							return `${name} - ${designation}`;
						},
					},
				},
			},
			{
				route: 'baseURL+/basePackageName/route',
				type: 'POST',
				body: {
					user: 'user',
					username: 'user.username',
					password: 'user.password',
					userPassword: {
						input1: 'user.username',
						input2: 'user.password',
						processor: (username, password) => {
							return `${username} - ${password}`;
						},
					},
				},
			},
		];
	}
} */
