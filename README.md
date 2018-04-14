[![CircleCI](https://circleci.com/gh/r-park/todo-react-redux.svg?style=shield&circle-token=6caf8c493bd66544717ff9a47ae01d8be036e53c)](https://circleci.com/gh/r-park/todo-react-redux)


# Teal Doocrate
Try the demo at https://doocrate2.firebaseapp.com.
A task management system which allows user to self assign themself
So normally you don't have permission unless you create a task or
assign yourself to a task.
This allows organization to manage tasks in a TEAL way

## Stack

- React, Redux, Thunk, React Router
- Firebase Firestore

Quick Start
-----------

```shell
$ git clone https://github.com/metaburn/doocrate.git
$ cd doocrate
$ npm install
$ cd functions
$ npm install
$ cd ..
$ npm run copy-staging
$ npm start
```

Admins
-----
Admins can edit any task.

Import the file under
`assets/database-example.json`
and add the uid of the app admins

## Deploying to Firebase
#### Prerequisites:
- Create a free Firebase account at https://firebase.google.com
- Create a project from your [Firebase account console](https://console.firebase.google.com)
- Configure the authentication providers for your Firebase project from your Firebase account console

#### Configure this app with your project-specific details:
```json
// .firebaserc

{
  "projects": {
    "default": "your-project-id"
  }
}
```

```javascript
// src/firebase/config.js

export const firebaseConfig = {
  apiKey: 'your api key',
  authDomain: 'your-project-id.firebaseapp.com',
  databaseURL: 'https://your-project-id.firebaseio.com',
  storageBucket: 'your-project-id.appspot.com'
};
```

## Deploy command
`deploy:staging`
OR 
`deploy:production`
Will build - use the correct config file and deploy

#### Staging
You can also set staging env and use:
`firebase use --add` to add your staging site
Then run like
`npm run build-staging`
`firebase use` and choose staging
`firebase deploy`

#### Install firebase-tools:
```shell
$ npm install -g firebase-tools
```

#### Build and deploy the app:
```shell
$ cd functions
$ npm install
$ cd ..
$ npm run build
$ firebase login
$ firebase use default
$ firebase deploy
```

## Setting up mail
We send emails on task comments to assignee
We've used mailgun since it allows 1000 messages free per day.
You need to make sure you set up Blaze-pay-as-you-go plan on firestore
Don't worry on normal use cases (800 users) you probably won't pay anything
Register here - https://www.mailgun.com/google

Run:
```
firebase functions:config:set email.send_notifications='true'
firebase functions:config:set email.from='Doocrate <noreply@midburnerot.com>'
firebase functions:config:set email.domain='midburnerot.com'
firebase functions:config:set email.apikey="Your-MailGun-Api-Key"
```

## Labels Colors
In order to create labels colors you need to create a collection called 'labels' with documents like so:
Id - The actual tag name - for example - "art", Then inside have a field "name" with value "art" and another field "colorInHex" with color value. For example "EB1478" - This will color all label of type "art" with color "EB1478"


## Backup
Firestore doesnt yet support backup natively
so we use this tool `npm install -g firestore-backup`
by calling `npm run backup`

## NPM Commands

|Script|Description|
|---|---|
|`npm start`|Start webpack development server @ `localhost:3000`|
|`npm backup`|Backup to a local database|
|`npm run deploy:staging`|Build and deploy to staging|
|`npm run deploy:production`|Build and deploy to production|
|`npm run build`|Build the application to `./build` directory|
|`npm test`|Test the application; watch for changes and retest|
