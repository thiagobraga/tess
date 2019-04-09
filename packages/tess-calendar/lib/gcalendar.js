const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {google} = require('googleapis');
const {promisify} = require('util');

const readFile = promisify(fs.readFile);

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(__dirname, '../', 'token.json');

/**
* Create an OAuth2 client with the given credentials, and then execute the
* given callback function.
* @param {Object} credentials The authorization client credentials.
* @param {function} callback The callback to call with the authorized client.
*/
const authorize = async (credentials) => {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    let token;

    try {
        // Check if we have previously stored a token.
        token = await readFile(TOKEN_PATH, 'utf8');
        oAuth2Client.setCredentials(JSON.parse(token));
        console.log('authorize', typeof oAuth2Client);
        return oAuth2Client;
    } catch (err) {
        if (err) return await getAccessToken(oAuth2Client);
    }
}

/**
* Get and store new token after prompting for user authorization, and then
* execute the given callback with the authorized OAuth2 client.
* @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
* @param {getEventsCallback} callback The callback for the authorized client.
*/
const getAccessToken = async (oAuth2Client) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
        });
           return oAuth2Client;
        });
    });
}

const nextWeek = async (auth) => {
    const calendar = google.calendar({version: 'v3', auth});
    try {
        const res = await calendar.events.list({
            calendarId: 'tesseractgrupo@gmail.com',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = res.data.items;
          if (events.length) {
            console.log('count', events.length);
            return events;
        } else {
            console.log('No upcoming events found.');
        }
    } catch (err) {
        if (err) return console.log('The API returned an error: ' + err);
    }
}

const nextMeetingLink = async () => {
  // TODO
}

const authenticate = async () => {
    try {

        const content = await readFile(path.join(__dirname, '../', '/credentials.json'), 'utf8');
        return await authorize(JSON.parse(content));
    } catch (err) {
        if (err) return console.log('Error loading client secret file:', err);
    }
}


module.exports = {
    authenticate,
    nextWeek,
    nextMeetingLink,
}