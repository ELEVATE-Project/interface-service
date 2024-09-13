'use strict'
const config = require('@configs/.config.json')

exports.routesConfigs = {
	services: ['user', 'mentoring', 'notification', 'scheduler'],
	routes: config.routes,
}
