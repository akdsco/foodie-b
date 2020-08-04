// Imports
import React from "react";
// CSS
import "../css/style.css";
// Components
import MapGoogle from "./MapGoogle";
// Dependencies
import Geocode from "react-geocode";
import { Button, Icon } from "semantic-ui-react";
import useObjectState from "./hooks/useObjectState";

//Firebase
const functions = require("firebase/functions");

//TODO firebase cloud function to get data from GoogleMaps API -> Change in this file needed

export default function Map({
  userLocation,
  restaurants,
  center,
  activeRest,
  handleRestSearch,
  handleActiveRest,
  handleCenterChange,
  handleNewData,
  handleZoomChange,
  flags,
}) {
  const { isRestSearchAllowed, isUserMarkerShown } = flags;
  const emptyRestData = { address: "", lat: "", lng: "" };

  const [state, setState] = useObjectState({
    isRestAddButtonDisplayed: false,
    isRestAddModalOpen: false,
    newRestData: emptyRestData,
  });

  function closeInfoWindow() {
    setState({
      isRestAddButtonDisplayed: false,
      newRestData: emptyRestData,
    });
  }

  function openInfoWindow(e) {
    let restData = {};

    Geocode.setApiKey(functions.config().foodieb.mapskey);
    Geocode.fromLatLng(e.latLng.lat(), e.latLng.lng()).then(
      (response) => {
        const address = response.results[0].formatted_address;
        restData = {
          address: address,
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };

        setState({
          isRestAddButtonDisplayed: true,
          newRestData: restData,
        });
      },
      (error) => {
        console.error("Geocode error: " + error);
      }
    );
  }

  return (
    <div>
      <MapGoogle
        restaurants={restaurants}
        center={center}
        userLocation={userLocation}
        userMarker={isUserMarkerShown}
        activeRest={activeRest}
        mapState={state}
        closeInfoWindow={closeInfoWindow}
        openInfoWindow={openInfoWindow}
        handleNewData={handleNewData}
        handleZoomChange={handleZoomChange}
        handleActiveRest={handleActiveRest}
        handleCenterChange={handleCenterChange}
      />
      <Button
        className="search-toggle-button"
        toggle
        active={isRestSearchAllowed}
        onClick={handleRestSearch}
      >
        {isRestSearchAllowed && (
          <p>
            <Icon name="check square" />
            Search as I move the map
          </p>
        )}
        {!isRestSearchAllowed && (
          <p>
            <Icon name="square outline" />
            Search as I move the map
          </p>
        )}
      </Button>
    </div>
  );
}
