'use strict';
const calendar = require('tess-calendar');

/**
 * The main router object
 */
const router = require('../lib/util').router();

/**
 * GET {domain}/nextweek/html
 */
router.get('/html', async (req, res) => {
    const html = await calendar.getHtml();
    res.writeHead(200);
    res.write(html, "binary");
    res.end();
});

/**
 * GET {domain}/nextweek/png
 */
router.get('/png',  async (req, res) => {
    const renderer = await calendar.createRenderer();
    const image = await renderer.nextWeekImage();
    renderer.close();
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