const functions = require("firebase-functions");
const express = require("express");
const fetch = require("node-fetch");
const send = require("../send.js");
const cors = require("cors")({ origin: "*" });

function loadRestaurantImage(req, res) {
  console.log("Loading Restaurant Image...");
  const { photosArray } = JSON.parse(req.body);

  const photoRef = photosArray[1]
    ? photosArray[1].photo_reference
    : photosArray[0]
    ? photosArray[0].photo_reference
    : "";

  console.log("photoRef: ", photoRef);

  const googlePhotoUrl =
    `https://maps.googleapis.com/maps/api/place/photo?` +
    `maxwidth=800` +
    `&photoreference=${photoRef}` +
    `&key=${functions.config().foodieb.mapkey}`;

  console.log("gPhotoUrl: ", googlePhotoUrl);

  const fetchGoogleImage = async () => {
    const response = await fetch(googlePhotoUrl, {
      method: "GET",
    });

    console.log("Response.url from fetch: ", response.url);

    send(res, 200, {
      restPhotoUrl: response.url,
    });
  };

  fetchGoogleImage()
    .then(() => console.log("Loading restaurant image succesful"))
    .catch((err) => console.log("Error when loading restaurant image: ", err));
}

const app = express();
app.use(cors);
app.post("/", (req, res) => {
  // Catch any unexpected errors to prevent crashing
  try {
    loadRestaurantImage(req, res);
  } catch (err) {
    console.log("Error in express catch: ", err);
    send(res, 500, {
      error: `The server received an unexpected error. Please try again and contact the site admin if the error persists.`,
    });
  }
});

module.exports = app;
