var admin = require("firebase-admin");
var fs = require('fs');

var serviceAccount = require("/Users/matan.zohar/Downloads/doocrate-production-firebase-adminsdk-uzlv2-40f79cfa90.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://doocrate-production.firebaseio.com"
});

fs.open('users_report.csv', 'w', function (err, file) {
    if (err) throw err;
  });

fs.appendFile('users_report.csv',  "\uFEFF \n", function (err) {
    if (err) throw err;
}); 

function userToString(userRecord) {
    var row = "";
    row += `"${userRecord.uid}",`;
    row += `"${userRecord.email}",`;
    row += `"${userRecord.displayName}",`;
    row += `"${userRecord.metadata.lastSignInTime}",`;
    row += `"${userRecord.metadata.creationTime}"\n`;

    fs.appendFile('users_report.csv', row, function (err) {
        if (err) throw err;
    }); 
    
}  

function listAllUsers(nextPageToken) {
    // List batch of users, 1000 at a time.
    admin.auth().listUsers(1000, nextPageToken)
      .then(function(listUsersResult) {
        listUsersResult.users.forEach(function(userRecord) {
            userToString(userRecord);
        });
        if (listUsersResult.pageToken) {
          // List next batch of users.
          listAllUsers(listUsersResult.pageToken);
        }
      })
      .catch(function(error) {
        console.log('Error listing users:', error);
      });
  }
  // Start listing users from the beginning, 1000 at a time.
  listAllUsers();
  console.log("done!")