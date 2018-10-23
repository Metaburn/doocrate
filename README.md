[![CircleCI](https://circleci.com/gh/r-park/todo-react-redux.svg?style=shield&circle-token=6caf8c493bd66544717ff9a47ae01d8be036e53c)](https://circleci.com/gh/r-park/todo-react-redux)


# Doocrate
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
git clone https://github.com/metaburn/doocrate.git
cd doocrate
npm install
cd functions
npm install
cd ..
npm run copy-staging
npm start
```

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

#### Install firebase-tools:
```shell
npm install -g firebase-tools
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

## Deploy command
`npm run deploy:staging`
OR 
`npm run deploy:production`
Will build - use the correct config file and deploy

#### Staging
You can also set staging env and use:
`firebase use --add` to add your staging site
Then run like
`npm run build-staging`
`firebase use` and choose staging
`npm run deploy:staging`

#### Build and deploy the app:
```shell
cd functions
npm install
cd ..
npm run build
firebase login
firebase use default
npm run deploy:production
// And if you want only to deploy without building you can run firebase deploy
```

## Creating index
After the system is up:
Create a new task And also create a new comment.
If you open the console you would get a link with something like:
```
database.js:944 Uncaught Error in onSnapshot: Error: The query requires an index. You can create it here: https://console.firebase.google.com/project/doocrate-2018/database/firestore/indexes?create_index=Eghjb21tZW50cxoKCgZ0YXNrSWQQAhoLCgdjcmVhdGVkEAIaDAoIX19uYW1lX18QAg
```
Click that link to create the indexing for it

## Labels Colors
Create a collection named
`labels`
In order to create labels colors you need to create a collection called 'labels' with documents like so:
Set for `Document Id` - The actual tag name - for example - "art"
Then inside have a field "name" with value "art" and another field "colorInHex" with color value. For example "EB1478" - This will color all label of type "art" with color "EB1478"

# Labels
Under `src/config/app-config` you have the popular labels that would appear when someone creates a task

## Backup
Downloag gcloud:
https://cloud.google.com/sdk/docs/downloads-versioned-archives

To backup you first need to create a new multi regional bucket - for example - doocrate-new-backups

Then, Run the following command to backup - 
`gcloud alpha firestore export gs://doocrate-new-backups`

## Restore from backup
Import all by calling `gcloud alpha firestore import gs://[BUCKET_NAME]/[EXPORT_PREFIX]/` where `[BUCKET_NAME]` and `[EXPORT_PREFIX]`
point to the location of your export files. For example - `gcloud alpha firestore import gs://exports-bucket/2017-05-25T23:54:39_76544/`

Import a specific collection by calling: `gcloud alpha firestore import --collection-ids='[COLLECTION_ID_1]','[COLLECTION_ID_2]' gs://[BUCKET_NAME]/[EXPORT_PREFIX]/`

## Translations
You can find translations under `public/locales/`

You can open the page with the required language. For example use
`http://localhost:3000/sign-in?lng=he` to open the hebrew version
`http://localhost:3000/sign-in?lng=en` to open the english version

# Stop the system
You can user the `/admin-dashboard` page if you are an admin to set permissions
You can press on the button their - This would go over all the users in the system and would set the
"canCreateTask, "canAssignTask" permissions which allows to create new tasks and assign / unassign themself 

## NPM Commands

|Script|Description|
|---|---|
|`npm start`|Start webpack development server @ `localhost:3000`|
|`npm backup`|Backup to a local database|
|`npm run deploy:staging`|Build and deploy to staging|
|`npm run deploy:production`|Build and deploy to production|
|`npm run build`|Build the application to `./build` directory|
|`npm test`|Test the application; watch for changes and retest|


## FAQ

#### What are projects
Project is the root for a task. Each task exists within a project

#### What are Admins
Admins can edit any task under a project.
Once a user creates a new project he is added into the `admins`
`admins`->`user id`->`projects`->`project id`
This helps us know which admin belongs to which projects

#### Why is Mail is not being sent?
Check that you are on the `blaze` (Pay as you go) plan. Otherwise external services such as mailgun aren't accessible. Don't worry. Firebase won't charge money unless you have > 10000 users from our calculations

Also, Check that all the settings are correct and you have created a mailgun username and set up the domain correctly

#### Is there a reports page
Yes `/reports`

#### Is there an admin page
Yes. `/admin-dashboard`

#### I'm getting this error:
```Uncaught DOMException: Failed to execute 'setRequestHeader' on 'XMLHttpRequest': 'projects/doocrate-production
                 /databases/(default)' is not a valid HTTP header field value.
```

1.Make sure you set up Firestore database by activating it in firebase console

2.Make sure that your config doesnt have a wrong char such as \n in the end:
`projectId: 'doocrate-production\n',

#### Why am I seeing the loader runs and runs on a new install
Only when there is at least one task it would stop running - Press on add task

#### Is there a way to close the system on the frontend side
Yes - under `src->config->app-config` set the parameter `isSystemClosed` to true

#### Is there a way to open / close new users from openning / assigning tasks
Yes - under `src->config->app-config` set the parameter `canNewUsersCreateAssignTask` to false

#### Comments are not working
Check you console. You need to follow the error using the link and create an index for comments
