'use strict';
const path = require('path');
const calendar = require('tess-calendar');
const GCALENDAR_CREDENTIALS = path.join(__dirname, "../", "/credentials.json");
const GCALENDAR_TOKEN = path.join(__dirname, "../", "/token.json");

/**
 * The main router object
 */
const router = require('../lib/util').router();

/**
 * GET {domain}/nextweek/html
 */
router.get('/', async (req, res) => {
    const auth = await calendar.authenticate(GCALENDAR_CREDENTIALS, GCALENDAR_TOKEN);
    const meetingLink = await calendar.nextMeetingLink(auth);
    res.writeHead(200);
    res.end(JSON.stringify(meetingLink));
});

module.exports = function(appObj) {
    return {
        path: '/meeting-link',
        api_version: 1,
        router
    };
};