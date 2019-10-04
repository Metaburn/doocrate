# What is this?
Here we keep all the server side code
We store our function as firebase functions (Similar to AWS Lambda - aka cloud functions)

# Local development
```
npm install
firebase functions:shell 
```

# Deployment
```
npm run build && firebase deploy
```

# Cloud functions
This part should be deployed to the firebase server

To deploy this functions use
`firebase deploy`

# Deploy
## Firebase plans
To allow `cloud functions` to go over the 50 queries per limit you might want to upgrade to **Blaze plan** - it's a pay as you go so at most cases it won't cost anything
