'use strict'
module.exports = {
	apps: [
		{
			name: 'mentored-interface',
			script: './app.js',
			watch: ['./'],
			watch_delay: 100,
			ignore_watch: [
				'client/img',
				'\\.git',
				'*.log',
				'package.json',
				'package-lock.json',
				'./configs/.config.json',
			],
		},
	],
}
