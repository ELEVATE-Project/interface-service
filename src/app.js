'use strict';
require('module-alias/register');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './.env' });
const path = require('path');
const packageInstaller = require('./utils/packageInstaller');
const executeScripts = require('./scripts');

        

(async () => {
    try {

        
        // First, install necessary packages
        await packageInstaller(process.env.REQUIRED_PACKAGES);
        
        // Next, execute fetchRouteConfigs and combineRoutesConfigs
        await executeScripts();

        const dependencyManager = require('@helpers/dependencyManager')
        await dependencyManager()

        // After scripts execution, continue with environment data validation
        let environmentData = require('./envVariables')();
        if (!environmentData.success) {
            console.error('Server could not start. Not all environment variables are provided');
            process.exit(1);
        }

        // Initialize the rest of the application (after the scripts are done)
        require('./init');

        // Create an Express app instance
        const app = express();
        app.set('trust proxy', parseInt(process.env.RATE_LIMITER_NUMBER_OF_PROXIES));

        // Middleware and CORS setup
        app.use(cors());

        // Set Access-Control-Allow-Origin header
        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_HOST);
            next();
        });

        // Load router packages and initialize the router
        const routerPackages = require('@utils/packageLoader').packageLoader();
        const validatedPackages = routerPackages; // Bypassing the validator for now
        const { initializeRouter } = require('@router');
        app.use(initializeRouter(validatedPackages));

        // Serve API documentation
        app.get(process.env.API_DOC_URL, (req, res) => {
            res.sendFile(path.join(__dirname, './api-doc/index.html'));
        });

        // Start the server
        app.listen(process.env.APPLICATION_PORT, (err) => {
            if (err) {
                onError(err);
            }
            console.log('Environment: ' + process.env.APPLICATION_ENV);
            console.log('Application is running on port: ' + process.env.APPLICATION_PORT);    
            
        });

    } catch (error) {
        // Handle any error from script execution or package installation
        console.error('Error in app initialization:', error);
        process.exit(1);
    }
})();
