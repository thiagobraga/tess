const telegraf = require('tess-telegraf')
const yaml = require('js-yaml');
const fs = require('fs');

const loadActions = async () => {
    actions = [];
    const conf = yaml.load(fs.readFileSync(`${__dirname}/config.yml`, 'utf8'));
    conf.actions.forEach((action) => {
        const params = Object.keys(action.params).map(key => {
            switch (key){
                case 'script':
                    return require(`${__dirname}/scripts/${action.params[key]}`)
                    break;
                case 'reply':
                    const reply = require(`${__dirname}/scripts/command-reply`);
                    return reply(action.params.reply);
                    break;
                default:
                    return action.params[key]
                    break;
            }
        });
        actions.push({
            type: action.type,
            params,
        });
    });
    return actions;
}


const initApp = async (options) => {
    options.actions = await loadActions();

    const app = await telegraf(options);

    app.serviceName = options.name;      // this app's config options
    app.config = options.config;      // this app's config options
    app.logger = options.logger;    // the logging device
    app.metrics = options.metrics;  // the metrics

    return app;
}

module.exports = async (options) => {

    const app = await initApp(options);        
    await app.launch();
    app.logger.log('info', "tess is listening to Telegram");
    return app;
};