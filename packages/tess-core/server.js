#!/usr/bin/env node
'use strict';

const ServiceRunner = require('service-runner');
const util = require('./lib/util');

let runner = new ServiceRunner();

(async () => {
    const services = await runner.start();
    if (process.env.ENABLE_CRON){
        await util.loadCron(services.shift());
    }
})()
