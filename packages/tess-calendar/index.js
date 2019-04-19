const Renderer = require('./lib/renderer');
const googleApi = require('./lib/google_api');
const calendar = require('./lib/calendar');
const authenticate = require('./lib/auth');

const _createRenderer = async () => {
    let renderer = new Renderer();
    await renderer.init({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    return renderer;
}

const nextWeekImage = async (auth) => {
    const renderer = await _createRenderer();
    let events = await googleApi.getNextWeek(auth);
    let html = await calendar.getWeekHtml(events);
    const image = await renderer.pageToPng(html, { fullPage: true });
    renderer.close();

    return image;
}

const nextWeekHtml = async (auth) => {
    let events = await googleApi.getNextWeek(auth);
    return await calendar.getWeekHtml(events);
}

const nextMeetingLink = async (auth) => {
    let meetingLink = await googleApi.getNextMeetingLink(auth);
    return meetingLink;
}

module.exports = {
    authenticate,
    nextWeekImage,
    nextWeekHtml,
    nextMeetingLink,
}