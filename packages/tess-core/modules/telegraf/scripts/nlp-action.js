const nlp = require('tess-nlp')

module.exports = async (ctx) => {
    const reaction = await nlp(ctx.message.text);
    console.log("reaction", reaction);
    if (reaction && reaction.action){
        if (reaction.action !== 'None'){
            const action = require(`${__dirname}/${reaction.action}`);
            ctx.reply(reaction.msg);
            action(ctx);
        } else {
            ctx.reply(reaction.msg);
        }
    }
}
