const express = require("express");
const fetch = require("node-fetch");
const send = require("../send.js");
const cors = require("cors")({ origin: "*" });

function loadRestaurants(req, res) {
  const { center, searchRadius, count } = JSON.parse(req.body);
  const { lat, lng } = center;

  // noinspection SpellCheckingInspection
  const url =
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
    `location=${lat},${lng}` +
    `&radius=${searchRadius}` +
    `&type=restaurant` +
    `&key=AIzaSyCnsXb23ade5cPti1lAGVRMGPVE90LFkhc`;

  function fetchGoogleData() {
    let idNumber = count - 1;
    return fetch(url, {
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
            streetViewURL:
              `https://maps.googleapis.com/maps/api/streetview?` +
              `size=500x300` +
              `&location=${r.geometry.location.lat},${r.geometry.location.lng}` +
              `&heading=151.78` +
              `&pitch=-0.76` +
              `&key=`,
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

  async function getData() {
    const data = await fetchGoogleData();
    await send(res, 200, { restaurants: data });
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
