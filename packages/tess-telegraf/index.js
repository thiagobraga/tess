const Telegraf = require('telegraf')
const fs = require('fs');

const initBot = async (options) => {
    const bot = new Telegraf(options.conf.token)

    // Load actions from options
    options.actions.map((action) => {
        bot[action.type](...action.params);
    });

    return bot;
}

module.exports = (options) => {
    return initBot(options);
};