# Tess
_Tess is a robot helper that loves the human kind._


## Install packages in all packages/directories
_NOTE: This project will use lerna in the future_

```
cd /path/to/tess
npm install
cd /path/to/tess/packages/tess-calendar
npm install
```

NOTE: This versions download headless chromium binary, just to make it easier to have the same environment accross differente workspaces. **It's 109.8 MB of extra download, keep this in mind.**

## First Run

Create a `credentials.json` file under tess-calendar package folder like the following template:
```
{
    "installed": {
        "client_id":"SOME_ID",
        "client_secret":"SOME_SECRET",
        "redirect_uris": ["http://localhost"]
    }
}
```

Create your credentials on the [Google APIs console](https://console.developers.google.com/) to access your Google Calendar account read only permissions.

Onde you have the credentials.json file, run the following script:
```
cd packages/tess-calendar
node first_auth.js
```

Access the provided link and get the confirmation code from the Google API. After the authentication you will see the code is in the URL, like this:
```
http://localhost/?code=SOME_CODE=https://www.googleapis.com/auth/calendar.readonly
```

That's temporary, really.

Copy the code and paste it in the terminal. You will see that a list is loaded right after you finish the setup. If you see nothing or get an error, fill an issue.

## Running after auth

In the root repository
```
npm start
```

Go to http://localhost:3000/nextweek/html. You should see a simple 1 week calendar.

Go to http://localhost:3000/nextweek/png. You should have the same calendar as an image.

## TODO

Tess will be a configurable service for running several background tasks and will have the ability to communicate through WhatsApp, Telegram and Slack.