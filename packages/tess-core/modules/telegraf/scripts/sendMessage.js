module.exports = (ctx, params) => {
    if (params) {
        ctx.telegram.sendMessage(params.chatId, params.msg);
    }
};