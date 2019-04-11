const puppeteer = require('puppeteer');
const { promisify } = require('util');
const path = require('path');
const domino = require('domino');
const moment = require('moment');
const fs = require('fs');
const gcalendar = require('./lib/gcalendar')

moment.locale('pt-BR');
const readFile = promisify(fs.readFile);

class Renderer {
    constructor(browser) {
        this.browser = browser;
    }

    async createPage(html) {
        const page = await this.browser.newPage()
        await page.setContent(html);
        return page
    }
    async nextWeekImage() {
        let page = null
        try {
            const html = await getHtml();
            page = await this.createPage(html)
            const buffer = await page.screenshot( { fullPage: true } );
            
            return buffer;
        } finally {
            if (page) {
                await page.close();
            }
        }
    }
    
    async close() {
        await this.browser.close()
    }
}

async function createRenderer() {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    return new Renderer(browser)
}

async function getHtml() {
    const auth = await gcalendar.authenticate();
    let events = await gcalendar.nextWeek(auth);
    events = await parseEvents(events);
    const html = await readFile(`${path.join(__dirname, 'calendar.html')}`, {encoding: 'utf8'});

    let doc = domino.createDocument(html);
    let calendar = doc.querySelector('.calendar');
    events.map((day, key) => {
        let column = doc.createElement('div');
        column.classList.add('day-column');
        let header = doc.createElement('div');
        column.appendChild(header);
        header.classList.add('day-header');
        header.innerHTML =`<div>${day.weekday}</div><div>${key}</div>`;
        day.events.map((event) => {
            let eventDiv = doc.createElement('div');
            eventDiv.classList.add('event');
            // Add Title
            let eventTitle = doc.createElement('div');
            eventTitle.classList.add('event-title');
            eventDiv.appendChild(eventTitle);
            eventTitle.innerHTML = event.title;
            // Add date
            let eventDate = doc.createElement('div');
            eventDate.classList.add('event-date');
            eventDiv.appendChild(eventDate);
            eventDate.innerHTML = event.date;
            // Add time
            let eventTime = doc.createElement('div');
            eventTime.classList.add('event-time');
            eventDiv.appendChild(eventTime);
            eventTime.innerHTML = event.time;
            // Append to column
            column.appendChild(eventDiv);
        });
        calendar.appendChild(column);
    });

    return doc.innerHTML;
}

async function parseEvents(events) {
    let parsedEvents = [];
    events.map((event) => {
        const weekday_number = moment(event.start.dateTime).format('D');
        parsedEvents[weekday_number] = parsedEvents[weekday_number] || { weekday: moment(event.start.dateTime).format('ddd'), events: [] };
        parsedEvents[weekday_number].events.push({
            title: event.summary,
            date: moment(event.start.dateTime).format('dddd, D [de] MMMM'),
            time: `${moment(event.start.dateTime).format('HH:mm')} até ${moment(event.end.dateTime).format('HH:mm')}`,
        })
    });
    return parsedEvents;
}

module.exports = {
    createRenderer,
    getHtml,
}