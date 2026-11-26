'use strict'

/**
 * name : fetchRouteConfigs.js
 * author : Adithya Dinesh
 * created-date : 04-Sep-2024
 * Description : Fetches routes from each service as provided in the .env file and creates routes config for each services. 
 * Seperates all orchestrated calls in a different file.
 */

// import requirements 
const request = require('../generics/request.js')
const schema = require('../constants/routeSchema.js')
const fs = require('fs').promises
const path = require('path')
const { execSync } = require('child_process')
const _ = require('lodash');
const Ajv = require("ajv"); // for validating schema
const ajv = new Ajv();

const currentDirectory = process.cwd(); //fetch the current working directory 
// output dir to create files 
const outputDir = path.join(currentDirectory, 'configs', 'routesConfigs') //join path to routesConfigs folder
const orchestratedFile = path.join(outputDir, 'orchestrated.json') //join path to orchestrated.json file

let orchestratedFileData = {
    routes: []
}

/**
 * Main fuction which fetches the routes from env file and creates json file in './configs/routesConfigs'
 */
async function fetchRouteConfigs() {
    try {

        try {
            // Check if the directory exists
            await fs.access(outputDir);
            console.log(`outputDir ${outputDir} already exists.`);
        } catch (error) {
            // If access fails, it means the outputDir doesn't exist, so create it
            await fs.mkdir(outputDir, { recursive: true });
            console.log(`outputDir ${outputDir} created.`);
        }
        // Fetch routes config file from env and split
        const fetchRouteUrls = process.env.ROUTE_CONFIG_JSON_URLS_PATHS.split(",");

        // Loop through the URLs one by one
        for (const fetchUrl of fetchRouteUrls) {
            if (fetchUrl !== '') {
                await constructJson(fetchUrl);  // Wait for each URL to be processed sequentially
            }
        }

        // Write all the orchestrated routes to the file 
        if (orchestratedFileData.routes.length > 0) {
            await handleOrchestratedRoutes(orchestratedFileData.routes);
        }

    } catch (error) {
        throw (error);
    }
}

/**
 * Construct the json file in required format and writes it into file
 * @param {String} url - The URL to fetch.
 */
async function constructJson(url) {
    try {
        let jsonData = {}

        if (isAValidUrl(url)) {
            // get the data in json format 
            jsonData = await request.get(url)
        } else if (await validateJsonFilePath(url)) {
            // load the json file from mentioned location
            jsonData.data = await loadJsonFile(url);
        } else {
            console.warn(`Route config not found (not a URL or an existing .json file): ${url}`)
        }

        jsonData.success = jsonData?.data?.routes?.length > 0 && isJsonValid(jsonData) ? true : false

        let fileData = {
            routes: []
        }


        if (jsonData.success) {
            // extract base package name to create json file 
            const outputFile = path.join(outputDir, jsonData.data.routes[0]?.targetPackages[0]?.packageName + '.json')

            jsonData.data.routes.forEach(async (eachRoute) => {
                if (!eachRoute.orchestrated) {
                    // If the API is not orchestrated, write it in the package-specific file
                    if (!isADuplicateRoute(eachRoute, fileData.routes) && await isAValidSchema(eachRoute, schema.passThroughRouteSchema)) {
                        fileData.routes.push(eachRoute);
                    }
                } else {
                    if (await isAValidSchema(eachRoute, schema.orchestratedRouteSchema)) {
                        orchestratedFileData.routes.push(eachRoute);
                    }
                }
            });
            // Ensure the directory exists
            const dir = path.dirname(outputDir);
            await fs.mkdir(dir, { recursive: true });

            // Write the JSON file (creates or overwrites the file)
            await fs.writeFile(outputFile, JSON.stringify(fileData, null, 4));

            console.log(`File generated : ' ${outputFile} '.`);
        }

    } catch (error) {
        console.error("Execution Halted : ", error)
        throw (error)
    }

}
/**
 * Handles orchestrated calls, opens the orchestrated.json file , checks for duplicate and writes into the file.
 * @param {Object} newRoutes - New routes object
 */
const handleOrchestratedRoutes = async (newRoutes) => {
    try {
        const existingRoutes = await fs.readFile(orchestratedFile, 'utf8')
        let fileWriteFlag = false
        let routes = []
        try {
            routes = JSON.parse(existingRoutes).routes || []
        } catch (error) {
            routes = []
        }

        newRoutes.forEach(async (routeDetails) => {
            if (!isADuplicateRoute(routeDetails, routes)) {
                routes.push(routeDetails)
                fileWriteFlag = true
            }
        })

        if (fileWriteFlag) await fs.writeFile(orchestratedFile, JSON.stringify({ routes }, null, 4));

    } catch (error) {
        if (error.code === 'ENOENT') {
            // if the file is not created , create
            await fs.writeFile(orchestratedFile, JSON.stringify({ routes: newRoutes }, null, 4));
            console.log(`File generated : ' ${orchestratedFile} '`);
        } else {
            console.log("-----> error : ", error)
        }
    }
}

// Function to check for duplicates in the routes
function isADuplicateRoute(newItem, existingItems) {
    try {
        return _.some(existingItems, item =>
            item.sourceRoute === newItem.sourceRoute &&
            item.type === newItem.type &&
            item.priority === newItem.priority &&
            item.inSequence === newItem.inSequence &&
            item.orchestrated === newItem.orchestrated &&
            _.isEqual(item.targetPackages, newItem.targetPackages) &&
            _.isEqual(item.responseMessage, newItem.responseMessage) &&
            _.isEqual(item.rateLimit, newItem.rateLimit)
        );
    } catch (error) {
        if (error.name === 'TypeError') return false;
    }
}

/**
 * Checks if the provided string is a valid URL or not
 * @param {String} path - URL path
 */
function isAValidUrl(path) {
    try {
        new URL(path);
        return true; // Input is a valid URL
    } catch (e) {
        return false; // Not a URL, may be a local file path
    }
}

/**
 * Checks if the provided Json object is matching the pre set schema.
 * @param {Object} newRoute - New routes object
 * @param {Object} schema - Pre-set schema
 */
async function isAValidSchema(newRoute, schema) {
    try {
        // Compile the schema
        const validate = ajv.compile(schema);

        // Validate the data
        const valid = validate(newRoute);
        // Output the result
        if (valid) return true

        throw { message: `Invalid Schema <Route Ignored> : ${newRoute} ` }

    } catch (error) {
        throw error
    }

}

/**
 * Checks if the provided string is a valid path or not
 * @param {String} uri - File path
 */
async function validateJsonFilePath(uri) {
    try {
        // Resolve the absolute path
        const absolutePath = path.resolve(uri);

        // Check if the path exists and is a file
        const stats = await fs.lstat(absolutePath);

        return stats.isFile() && path.extname(absolutePath).toLowerCase() === '.json';
    } catch (error) {
        // If an error occurs, it's not a valid local path or file
        return false;
    }
}

/**
 * Loads the json data from the file
 * @param {String} filePath - File path
 */
async function loadJsonFile(filePath) {
    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        throw {
            message: `Failed to load Json file. File path : ${filePath} `
        };
    }
}

/**
 * Checks if the provided json is valid or not
 * @param {Object} jsonData - Json object
 */

function isJsonValid(jsonData) {
    try {
        typeof jsonData === "string" ? JSON.parse(jsonData) : ""; // Attempt to parse the JSON string
        return true; // If parsing succeeds, it's a valid JSON
    } catch (error) {
        throw {
            message: `Invalid Json : ${jsonData}`
        }
    }
}
module.exports = { executeFetchRoutesScript }

/**
 * Executes the functions in the script.
 */
async function executeFetchRoutesScript() {
    try {
        await fetchRouteConfigs()
        console.log('Route fetch Script executed successfully.')
    } catch (error) {
        throw error.message || 'Error occurred while running the script'

    }
}
