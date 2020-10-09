#!/usr/bin/env node
/*jshint esversion: 6 */
const Express = require('express');
const fs = require('fs');
const glob = require('glob');
const path = require('path');

const app = Express();
const {
    path: PATH,
    glob: GLOB,
    port: PORT,
    scenario: SCENARIO,
    version: VERSION = 'NOT_PASSSED'
}
    = require('yargs')
        .string('p')
        .alias('p', 'path')
        .string('g')
        .alias('g', 'glob')
        .string('port')
        .default('port', '8083')
        .string('s')
        .alias('s', 'scenario')
        .string('v')
        .alias('v', 'version')
        .argv;

if (VERSION === 'NOT_PASSSED') {
    const workingPath = PATH == undefined ? path.resolve('.') : path.resolve(PATH);
    console.log('[json-mock-server] Current Working Directory is set to ', workingPath, '\n');

    if (GLOB === undefined) {
        console.log('GLOB is undefined');
        throw new Error('No files defined.');
    }
    const scenarioResp = SCENARIO == undefined ? 'response' : `response${SCENARIO}`;
    glob.sync(GLOB, {
        absolute: true,
        cwd: workingPath,
        matchBase: true,
    })
        .map((file) => fs.readFileSync(file, 'utf-8'))
        .map((file) => JSON.parse(file))
        .forEach((mock) => {
            try {
                const apiString = `${mock.method.toUpperCase()} ${mock.path}`;
                console.log(`[json-mock-server] ${apiString} added`);
                app[mock.method](mock.path, (req, res) => {
                    console.log(`${new Date().toLocaleString()} | [json-mock-server] | ${apiString} called | scanario ${mock[scenarioResp] ? 'CUSTOM:' + scenarioResp : 'DEFAULT:response'}`);
                    const at = req.headers.authorisation;
                    if (mock.authorised) {
                        if (at) {
                            if (at.length > 5) {
                                serverResponse(res, mock, scenarioResp);
                            } else {
                                res.status(403).send({ msg: 'Invalid Access Token' });
                            }
                        } else {
                            res.status(403).send({ msg: 'Access Token Missing' });
                        }
                    } else {
                        serverResponse(res, mock, scenarioResp);
                    }
                });
            } catch (err) {
                console.error(`${err.name} -- ${err.message}`);
            }
        });
    function serverResponse(res, mock, scenario) {
        if (mock[scenario]) {
            res.status(mock[scenario].status).send(mock[scenario].data);
        } else {
            res.status(mock.response.status).send(mock.response.data);
        }
    }
    app.listen(PORT, () => {
        console.log(`\n${new Date().toLocaleString()} | [json-mock-server] | Server started at ${PORT} trying ${scenarioResp}\n---------------------\n`);
    });
} else {
    const packageJson = require('./package.json');
    console.log(`${packageJson.name} \n${packageJson.version}\n`);
}