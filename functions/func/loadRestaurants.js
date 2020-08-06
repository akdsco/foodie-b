const functions = require("firebase-functions");
const express = require("express");
const fetch = require("node-fetch");
const send = require("../send.js");
const cors = require("cors")({ origin: "*" });

function loadRestaurants(req, res) {
  const { center, searchRadius, count } = JSON.parse(req.body);
  const { lat, lng } = center;

  async function fetchGoogleImage(data) {
    return await Promise.all(
      data.map(async (restaurant) => {
        const googlePhotoUrl =
          `https://maps.googleapis.com/maps/api/place/photo?` +
          `maxwidth=150` +
          `&photoreference=${restaurant.photo_reference}` +
          `&key=${functions.config().foodieb.mapkey}`;

        const res = await fetch(googlePhotoUrl, {
          method: "GET",
        });
        const { photo_reference, ...rest } = restaurant;
        return {
          ...rest,
          thumb_photo_url: res.url,
        };
      })
    );
  }

  const googlePlaceUrl =
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
    `location=${lat},${lng}` +
    `&radius=${searchRadius}` +
    `&type=restaurant` +
    `&key=${functions.config().foodieb.mapkey}`;

  function fetchGoogleData() {
    let idNumber = count - 1;
    return fetch(googlePlaceUrl, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data.results.map((r) => {
          idNumber += 1;
          return {
            id: idNumber,
            photo_reference: r.photos[0] ? r.photos[0].photo_reference : "",
            place_id: r.place_id,
            isFromFile: false,
            numberOfReviews:
              r.user_ratings_total > 5 ? 5 : r.user_ratings_total,
            avgRating: r.rating,
            restaurantName: r.name,
            address: r.vicinity,
            lat: r.geometry.location.lat,
            lng: r.geometry.location.lng,
            open: r.opening_hours ? r.opening_hours.open_now : true,
            loadedDetails: false,
          };
        });
      })
      .catch((err) => {
        console.log("Problem when fetching from Google Places API: ", err);
      });
  }
  1;

  async function getData() {
    const googleRestaurants = await fetchGoogleData();
    const restaurantsWithImageLink = await fetchGoogleImage(googleRestaurants);
    send(res, 200, { restaurants: restaurantsWithImageLink });
  }

  getData()
    .then(() => console.log("Job done successfully."))
    .catch((err) => console.log("Sorry, error in function getData(): ", err));
}

const app = express();
app.use(cors);
app.post("/", (req, res) => {
  // Catch any unexpected errors to prevent crashing
  try {
    loadRestaurants(req, res);
  } catch (err) {
    console.log("Error in express catch: ", err);
    send(res, 500, {
      error: `The server received an unexpected error. Please try again and contact the site admin if the error persists.`,
    });
  }
});

module.exports = app;
