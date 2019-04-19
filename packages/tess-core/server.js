#!/usr/bin/env node
'use strict';

const ServiceRunner = require('service-runner');
const util = require('./lib/util');

let runner = new ServiceRunner();

(async () => {
    const services = await runner.start();
    await util.loadCron(services.shift());
    // if (runner.conf.enable_cron){
    //     await runner.loadCron();
    // }
})()
