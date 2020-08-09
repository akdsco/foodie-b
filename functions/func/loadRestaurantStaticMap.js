const functions = require("firebase-functions");
const express = require("express");
const fetch = require("node-fetch");
const send = require("../send.js");
const cors = require("cors")({ origin: "*" });

function loadRestaurantStaticMap(req, res) {
  const { restaurant } = JSON.parse(req.body);
  const { lat, lng } = restaurant;

  const googleStaticMapUrl =
    `https://maps.googleapis.com/maps/api/staticmap?` +
    `center=${lat},${lng}` +
    `&zoom=16` +
    `&size=640x480` +
    `&markers=color:red%7Clabel:We are here%7C${lat},${lng}` +
    `&key=${functions.config().foodieb.mapkey}`;

  const fetchGoogleStaticMap = async () => {
    const response = await fetch(googleStaticMapUrl, {
      method: "GET",
    });
    send(res, 200, {
      restMapUrl: response.url,
    });
  };

  fetchGoogleStaticMap()
    .then(() => console.log("Loading restaurant map succesful"))
    .catch((err) => console.log("Error when loading restaurant map: ", err));
}

const app = express();
app.use(cors);
app.post("/", (req, res) => {
  // Catch any unexpected errors to prevent crashing
  try {
    loadRestaurantStaticMap(req, res);
  } catch (err) {
    console.log("Error in express catch: ", err);
    send(res, 500, {
      error: `The server received an unexpected error. Please try again and contact the site admin if the error persists.`,
    });
  }
});

module.exports = app;
