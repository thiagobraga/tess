'use strict'

const calendar = require('./packages/tess-calendar');
const express = require('express');

let app = express();

app.get('/nextweek/png', async (req, res) => {
    const renderer = await calendar.createRenderer();
    const image = await renderer.nextWeekImage();
    renderer.close();
    res.set({
        'Content-Type': 'image/png',
        'Content-Length': image.length,
      }).send(image);
});

app.get('/nextweek/html', async (req, res) => {
    const html = await calendar.getHtml();
    res.writeHead(200);
    res.write(html, "binary");
    res.end();
});

app.listen(3000, () => {
    console.log("The server is listening on http://localhost:3000");
});