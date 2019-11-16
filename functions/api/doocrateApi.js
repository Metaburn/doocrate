"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
try {
  admin.initializeApp();
}catch (e) {
  // continue - app was already initialized
}

const express = require("express");
const cookieParser = require("cookie-parser")();
const cors = require("cors")();
const app = express();
const {FirebaseAuthMiddleware} = require("./middleware/firebaseAuth");

const auth = require("./auth/auth");

app.use(cors);
app.use(cookieParser);
app.use(FirebaseAuthMiddleware);

const firestore = admin.firestore();
app.locals.firestore = firestore;

app.get("/api/auth/user", auth.user);
app.get("/api/auth/project_permissions", auth.project_permissions);
app.get("/api/", (req, res) => {
  res.send("Doocrate is alive 🦄");
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.https.onRequest(app);
