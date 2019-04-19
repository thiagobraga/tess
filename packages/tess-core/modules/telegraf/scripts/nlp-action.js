const nlp = require('tess-nlp')
const path = require('path')
const moduleDir = path.join(__dirname, '../..', '/node-nlp')

module.exports = async (ctx) => {
    const reaction = await nlp(moduleDir, ctx.message.text);
    if (reaction){
        if (reaction.action && reaction.action !== 'None'){
            const action = require(`${__dirname}/${reaction.action}`);
            ctx.reply(reaction.msg);
            action(ctx);
        } else {
            ctx.reply(reaction.msg);
        }
    }
}
