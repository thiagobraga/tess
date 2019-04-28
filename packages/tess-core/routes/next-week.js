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
router.get('/html', async (req, res) => {
    const auth = await calendar.authenticate(GCALENDAR_CREDENTIALS, GCALENDAR_TOKEN);
    const html = await calendar.nextWeekHtml(auth);
    res.writeHead(200);
    res.write(html, "binary");
    res.end();
});

/**
 * GET {domain}/nextweek/png
 */
router.get('/png',  async (req, res) => {
    const auth = await calendar.authenticate(GCALENDAR_CREDENTIALS, GCALENDAR_TOKEN);
    const image = await calendar.nextWeekImage(auth);
    res.set({
        'Content-Type': 'image/png',
        'Content-Length': image.length,
      }).send(image);
});


module.exports = function(appObj) {
    return {
        path: '/nextweek',
        api_version: 1,
        router
    };
};