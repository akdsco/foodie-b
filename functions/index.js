const functions = require("firebase-functions");
const admin = require("firebase-admin");

//Cloud functions for user interaction
const loadRestaurants = require("./func/loadRestaurants");
const loadRestaurantImage = require("./func/loadRestaurantImage");
const loadRestaurantDetails = require("./func/loadRestaurantDetails");
const loadRestaurantStaticMap = require("./func/loadRestaurantStaticMap");

//Initialize the app
admin.initializeApp();

exports.loadRestaurants = functions.https.onRequest(loadRestaurants);
exports.loadRestaurantImage = functions.https.onRequest(loadRestaurantImage);
exports.loadRestaurantDetails = functions.https.onRequest(
  loadRestaurantDetails
);
exports.loadRestaurantStaticMap = functions.https.onRequest(
  loadRestaurantStaticMap
);
