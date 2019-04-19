'use strict';

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const schedule = require('node-schedule');

const loadRoutes = (app, dir) => {
    return new Promise((resolve, reject) => {
        fs.readdirSync(dir).map((fname) => {
            const resolvedPath = path.resolve(dir, fname);
            const isDirectory = fs.statSync(resolvedPath).isDirectory();
            if (isDirectory) {
                loadRoutes(app, resolvedPath);
            } else if (/\.js$/.test(fname)) {
                const routeModule = require(`${dir}/${fname}`);
                const route = routeModule(app);
                if (route !== undefined) {
                    app.use(route.path, route.router);
                }
                return route;
            }
            return false;
        });

        resolve(app);
    });
}

function createServer(app) {
    return new Promise((resolve, reject) => {
        app.listen(app.conf.port);
        console.log(`${app.opt_name} running at http://localhost:${app.conf.port}`);
        resolve(app);
    });
}

function initApp(options) {
    
    const app = express();

    app.opt_name = options.name;      // this app's config options
    app.conf = options.conf;      // this app's config options

    if (!app.conf.port) {
        app.conf.port = 8888;
    }

    // CORS
    app.all('*', ( req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader("Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    return Promise.resolve(app);
}

module.exports = (options) => {
    // TODO: Promisify it all
    return initApp(options)
    .then(app => loadRoutes(app, './routes'))
    .then(createServer)
};
