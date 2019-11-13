'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
try {
  admin.initializeApp();
}catch (e) {
  // continue - app was already initialized
}

const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: false}); //TODO maybe true?
const app = express();
const {validateFirebaseIdToken} = require('./server_auth');


app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);
app.get('/hello', (req, res) => {
  res.send(`Hello ${req.user.name}`);
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.https.onRequest(app);
