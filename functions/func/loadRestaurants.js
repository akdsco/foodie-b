const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const fetch = require("node-fetch");
const send = require("../send.js");
const cors = require("cors")({ origin: "*" });

function loadRestaurants(req, res) {
  // console.log("loadRestaurants starting up...");
  console.log("Request body: ", req.body);
  const { center, searchRadius } = req.body;
  const { lat, lng } = center;

  // noinspection SpellCheckingInspection
  const url =
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
    `location=${lat},${lng}` +
    `&radius=${searchRadius}` +
    `&type=restaurant` +
    `&key=AIzaSyCnsXb23ade5cPti1lAGVRMGPVE90LFkhc`;
  console.log(url);

  function fetchGoogleData() {
    return new Promise((resolve, reject) => {
      let count = 0;
      fetch(url, {
        method: "GET",
      })
        .then((response) => {
          response.json().then((data) => {
            resolve(
              data.results.map((r) => {
                count += 1;
                return {
                  id: count,
                  streetViewURL:
                    `https://maps.googleapis.com/maps/api/streetview?` +
                    `size=500x300` +
                    `&location=${r.geometry.location.lat},${r.geometry.location.lng}` +
                    `&heading=151.78` +
                    `&pitch=-0.76` +
                    `&key=AIzaSyCnsXb23ade5cPti1lAGVRMGPVE90LFkhc`,
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
              })
            );
          });
        })
        .catch((err) => {
          console.log("Error when fetching from Google Places API: ", err);
          reject(new Error("Problem when fetching from Google Places API."));
        });
    });
  }

  async function getData() {
    const data = await fetchGoogleData();
    console.log(data.filter((rec) => rec.id));
    send(res, 200, { restaurants: data });
  }

  getData()
    .then(() => console.log("Job done."))
    .catch((err) => console.log("Sorry, error: ", err));
}

const appLoadRestaurants = express();
appLoadRestaurants.use(cors);
appLoadRestaurants.post("/", (req, res) => {
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

module.exports = appLoadRestaurants;
