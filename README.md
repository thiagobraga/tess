# Tess
_Tess is a robot helper that loves the human kind._

## Dependencies

- [Yarn](https://yarnpkg.com/pt-BR/)
- [Lerna](https://lerna.js.org/)

## Install

In the root repository:
``` sh
yarn
lerna bootstrap
```

> NOTE: This version download headless chromium binary, just to make it easier to have the same environment accross different workspaces.
>
> It's **109.8 MB** of extra download, keep this in mind.

### First Run

Create a `credentials.json` file under `tess-calendar` package folder like the following template:
``` json
{
  "installed": {
    "client_id": "SOME_ID",
    "client_secret": "SOME_SECRET",
    "redirect_uris": ["http://localhost"]
  }
}
```

Create your credentials on the [Google APIs console](https://console.developers.google.com/) to access your Google Calendar account read only permissions.

Once you have the `credentials.json` file, run the following script:
``` sh
cd packages/tess-calendar
node first_auth.js
```

Access the provided link and get the confirmation code from the Google API. After the authentication you will see the code is in the URL, like this:
```
http://localhost/?code=SOME_CODE=https://www.googleapis.com/auth/calendar.readonly
```

That's temporary, really.

Copy the code and paste it in the terminal. You will see that a list is loaded right after you finish the setup. If you see nothing or get an error, fill an issue.

### Setting config.yaml for tess-core
``` sh
cd packages/tess-core
cp config.example.yaml config.yaml
```

Add the Telegram token for under `tess-telegraf` service configuration.

### Running after auth

In the root repository
``` sh
cd packages/tess-core
yarn start
```

## Usage

- http://localhost:3000/nextweek/html  
You should see a simple 1 week calendar.
- http://localhost:3000/nextweek/png  
You should have the same calendar as an image.
- Interact with tess on Telegram.

## Roadmap

- [ ] Write tests
- [ ] Enable Travis CI
- [ ] Install eslint
- [ ] Enable Logger through all the packages
- [ ] Setup page for Google API authentication
- [ ] Error Handling
- [ ] Persistence layer for job scheduler
- [ ] Metrics
- [ ] CSS improvements
- [ ] Write instructions to interact with Tess on Telegram
