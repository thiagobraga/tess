'use strict';

const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
var scheduler = require('node-schedule');

const baseDir = path.join(`${__dirname}`, '../');

class ServiceRunner {
    constructor(){
        this._services = {};
    }

    async start() {
        this.conf = yaml.load(fs.readFileSync('./config.yaml', 'utf8'));
        
        for (const service of this.conf.services) {
            const serviceStartup = require(`../${service.module}`);
            const app = await serviceStartup(service);
            this._services[service.name] = app;
        }

        return this._services;
    }

    get services() {
        return this._services;
    }

    get conf() {
        return this.conf;
    }

    async loadCron() {
        fs.readdirSync(`${baseDir}/cron`).map((fname) => {
            const cron = yaml.load(fs.readFileSync(`${baseDir}/cron/${fname}`, 'utf8'));
            const { tessModule, schedule, tasks } = cron;
            tasks.map((task) => {
                const service = this._services[tessModule]; 
                const script = task['script'] && tessModule && require(`${baseDir}/modules/${tessModule}/scripts/${task['script']}`);
                scheduler.scheduleJob(schedule, function(){
                  script(service, task.parameters);
                });
            });
        });
    }
}

module.exports = ServiceRunner;
