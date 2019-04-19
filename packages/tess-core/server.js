#!/usr/bin/env node
'use strict';

const ServiceRunner = require('./lib/service-runner');
let runner = new ServiceRunner();

(async () => {
    await runner.start();
    if (runner.conf.enable_cron){
        await runner.loadCron();
    }
})()
