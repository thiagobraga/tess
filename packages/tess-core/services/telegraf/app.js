const telegraf = require('tess-telegraf')
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const basedir = path.join(__dirname, '../..', '/modules/telegraf')

const loadActions = async () => {
    actions = [];
    const conf = yaml.load(fs.readFileSync(`${basedir}/config.yml`, 'utf8'));
    conf.actions.forEach((action) => {
        const params = Object.keys(action.params).map(key => {
            return key === 'script' ? require(`${basedir}/scripts/${action.params[key]}`) : action.params[key];
        });
        actions.push({
            type: action.type,
            params,
        });
    });
    return actions;
}

module.exports = async (options) => {
    options.actions = await loadActions();
    const tess = await telegraf(options);
    tess.launch();
    console.log("tess is listening to Telegram");
};