// Currying the function
module.exports = (msg) => {
    return async (ctx) => {
        await ctx.reply(msg)    
    }
}