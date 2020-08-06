const functions = require("firebase-functions");
const express = require("express");
const fetch = require("node-fetch");
const send = require("../send.js");
const cors = require("cors")({ origin: "*" });

function loadRestaurantDetails(req, res) {
  const { placeID } = JSON.parse(req.body);

  let url =
    `https://maps.googleapis.com/maps/api/place/details/json?` +
    `placeid=${placeID}` +
    `&key=${functions.config().foodieb.mapkey}`;

  function getGoogleData() {
    return fetch(url, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status === "OK") {
          // debug log
          // console.log('PlaceID details ', data.result);
          const reviews = () =>
            data.result.reviews.map((r, id) => {
              return {
                id: id,
                name: r.author_name,
                stars: r.rating,
                comment: r.text,
                image_url: r.profile_photo_url,
              };
            });

          return {
            fullAddress: data.result.adr_address,
            reviews: reviews(),
            services: data.result.types,
            photos: data.result.photos,
            link: data.result.website,
            openingHours: data.result.opening_hours
              ? data.result.opening_hours
              : { weekday_text: ["Open 24 / 7"] },
            phoneNumber: data.result.international_phone_number,
          };
        } else {
          throw new Error(`Failed to load details: ${data.status}`);
        }
      })
      .catch((err) => {
        console.log("Failed to load Google Place Details: ", err);
      });
  }

  async function getData() {
    const details = await getGoogleData();
    send(res, 200, { details: details });
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
    loadRestaurantDetails(req, res);
  } catch (err) {
    console.log("Error in express catch: ", err);
    send(res, 500, {
      error: `The server received an unexpected error. Please try again and contact the site admin if the error persists.`,
    });
  }
});

module.exports = app;
