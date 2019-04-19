const calendar = require('tess-calendar');
const fs = require('fs');
const path = require('path');
const basedir = path.join(__dirname, "../../..", "/static");
const GCALENDAR_CREDENTIALS = path.join(__dirname, "../../..", "/credentials.json");
const GCALENDAR_TOKEN = path.join(__dirname, "../../..", "/token.json");

module.exports = async (ctx, params) => {
    const auth = await calendar.authenticate(GCALENDAR_CREDENTIALS, GCALENDAR_TOKEN);
    const image = await calendar.nextWeekImage(auth);
    fs.writeFile(`${basedir}/week_calendar.png`, image, 'base64', function(err){
        if (err) console.log(err);
    });
    if (params && params.length) { // Sending a scheduled message
        await ctx.telegram.sendMessage(params.chatId, params.msg);
        await ctx.telegram.sendChatAction(params.chatId, 'upload_photo')
        await ctx.telegram.sendPhoto(params.chatId, {source: `${basedir}/week_calendar.png`})
    } else { // Replying to a request
        await ctx.replyWithChatAction('upload_photo')
        await ctx.replyWithPhoto({source: `${basedir}/week_calendar.png`})
    }
}