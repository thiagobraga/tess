const calendar = require('tess-calendar');
const fs = require('fs');
const path = require('path');
const basedir = path.join(__dirname, "../../..", "/static");
const GCALENDAR_CREDENTIALS = path.join(__dirname, "../../..", "/credentials.json");
const GCALENDAR_TOKEN = path.join(__dirname, "../../..", "/token.json");

module.exports = async (ctx) => {
    const auth = await calendar.authenticate(GCALENDAR_CREDENTIALS, GCALENDAR_TOKEN);
    const meeting = await calendar.nextMeetingLink(auth);

    if (meeting.summary){
        await ctx.reply(`Evento: ${meeting.summary}`)
    }
    if (meeting.hangoutLink){
        await ctx.reply(`Hangout: ${meeting.hangoutLink}`)
    }
    if (Array.isArray(meeting.confirmedAttendees) && meeting.confirmedAttendees.length){
        await ctx.reply(`As seguintes pessoas confirmaram presença:`)
        meeting.confirmedAttendees.map(async (attendee) => {
            await ctx.reply(`- ${attendee.displayName}`)
        });
    } else {
        await ctx.reply(`Ninguém confirmou presença até o momento.`)
    }
}