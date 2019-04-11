const calendar = require('tess-calendar');
const fs = require('fs');
const path = require('path');
const basedir = path.join(__dirname, "../../..", "/static");

module.exports = async (ctx) => {
    const renderer = await calendar.createRenderer();
    const image = await renderer.nextWeekImage();
    renderer.close();
    fs.writeFile(`${basedir}/week_calendar.png`, image, 'base64', function(err){
        if (err) console.log(err);
    });

    await ctx.replyWithChatAction('upload_photo')
    await ctx.replyWithPhoto({source: `${basedir}/week_calendar.png`})
}