# What is this?
Here we keep all the server side code
We store our function as firebase functions (Similar to AWS Lambda - aka cloud functions)

# Where are the functions locations?
You can see them under `index.js`

# Local development
```
npm install
firebase functions:shell 
```

# Deployment
```
## From the root directory run ../
npm run build && firebase deploy
```

# Deploy only the functions
```
firebase deploy --only functions
```

# Testing Locally
Start the shell
```
firebase functions:shell
```
Then you can try
```
onNewCommentSendEmail.onNewCommentSendEmail({before: {}, after: {taskId: 'taskid', creator:{name:'tester'}} })
```
Or this (Actually this doesnt work but keeping here if future me wants to fix this)
```
onEditTaskSendEmail.onEditTaskSendEmail({before: {id:"test", creator:{id:"1",name:"tester"}, assignee:{id:"2"}},after: {id: "test", creator:{id: "3",name:"tester"}} })
```

# Cloud functions
This part should be deployed to the firebase server

To deploy this functions use
`firebase deploy`

# API
We also have an `api` stored under the api folder
To test the api locally:
```
firebase functions:shell
api("/")
api("/hello",{headers: {"bearer":"sample token"}})
```

# Deploy
## Firebase plans
To allow `cloud functions` to go over the 50 queries per limit you might want to upgrade to **Blaze plan** - it's a pay as you go so at most cases it won't cost anything
