const functions = require("firebase-functions");
const admin = require("firebase-admin");

//Cloud functions for user interaction
const loadRestaurants = require("./func/loadRestaurants");
const loadRestaurantDetails = require("./func/loadRestaurantDetails");

//Initialize the app
admin.initializeApp();

exports.loadRestaurants = functions.https.onRequest(loadRestaurants);
exports.loadRestaurantDetails = functions.https.onRequest(
  loadRestaurantDetails
);
