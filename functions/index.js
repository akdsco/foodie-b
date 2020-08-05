const functions = require("firebase-functions");
const admin = require("firebase-admin");

//Cloud functions for user interaction
const loadRestaurants = require("./func/loadRestaurants");

//Initialize the app
admin.initializeApp();

exports.loadRestaurants = functions.https.onRequest(loadRestaurants);

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
