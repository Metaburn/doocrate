# Setting your own server
Read this if you are planning to deploy a new version of doocrate.com - otherwise you can return to the main [README.md](../README.md)

## Deploying a new version
#### Prerequisites:
- Create a free Firebase account at https://firebase.google.com
- Create a project from your [Firebase account console](https://console.firebase.google.com)
- Configure the authentication providers by going to: 
  Your firebase project->Authentication->Set up sign-in method-> Facebook -> Enable
  (Go to http://developers.facebook.com/ and My Apps-> Create a new app. Use that app id and app secret. Add under your facebook app Add a new Facebook Login and set the Valid OAuth Redirect URIs to the one firebase gives youA)
  Then for google perform -> Google -> Enable - set a project name
- Configure firebase Firestore. Database->Firestore->Enable
- Add a Webapp to your firebase by going here:
`https://console.firebase.google.com/u/0/project/doocrate-production/settings/general/`
And choosing `Add Firebase to your web app`

## Set up firestore rules
Rules are a way to restrict access to the database and give different users different permissions
For example - Anyone can create a task. But only a task creator (And assignee)can edit a task

copy the content of `firestore.rules` file into Rules of your project. For example - 
`https://console.firebase.google.com/u/0/project/doocrate-production/database/firestore/rules`
Then hit `Publish` to save it

## Create new firestore database
Go to Database->Create new Firestore database and set the default settings

#### Configure this app with your project-specific details:
edit the file .firebaserc
```json
// .firebaserc

{
  "projects": {
    "default": "your-project-id"
  }
}
```

Edit `config.production.js` and `app-config.js` to be set to
```javascript
// src/firebase/config.production.js

export const firebaseConfig = {
  apiKey: 'your api key',
  authDomain: 'your-project-id.firebaseapp.com',
  databaseURL: 'https://your-project-id.firebaseio.com',
  storageBucket: 'your-project-id.appspot.com'
};
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
firebase functions:config:set email.from='<support@doocrate.com>'
firebase functions:config:set email.domain='doocrate.com'
firebase functions:config:set email.apikey="Your-MailGun-Api-Key"

Then in the future if you want to deploy only function - use this command (No need right now - better run deploy staging / production)
firebase deploy --only functions
```


## Firebase plans
To allow `cloud functions` to go over the 50 queries per limit you might want to upgrade to blaze plan - it's a pay as you go so at most cases it won't cost anything
