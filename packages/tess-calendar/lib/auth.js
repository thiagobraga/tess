const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {google} = require('googleapis');
const {promisify} = require('util');

const readFile = promisify(fs.readFile);

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

/**
* Create an OAuth2 client with the given credentials, and then execute the
* given callback function.
* @param {Object} credentials The authorization client credentials.
* @param {function} callback The callback to call with the authorized client.
*/
const authorize = async (credentials, tokenFile) => {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    let token;

    try {
        // Check if we have previously stored a token.
        token = await readFile(tokenFile, 'utf8');
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
    } catch (err) {
        if (err) return await getAccessToken(oAuth2Client, tokenFile);
    }
}

/**
* Get and store new token after prompting for user authorization, and then
* execute the given callback with the authorized OAuth2 client.
* @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
* @param {getEventsCallback} callback The callback for the authorized client.
*/
const getAccessToken = async (oAuth2Client, tokenFile) => {
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
        fs.writeFile(tokenFile, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', tokenFile);
        });
           return oAuth2Client;
        });
    });
}

module.exports = async (credentialFile, tokenFile) => {
    try {
        const content = await readFile(credentialFile, 'utf8');
        return await authorize(JSON.parse(content), tokenFile);
    } catch (err) {
        if (err) return console.log('Error loading client secret file:', err);
    }
}