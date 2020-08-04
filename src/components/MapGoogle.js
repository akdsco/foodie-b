import React, { useState } from "react";
// Dependencies
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
// Components
import AddRest from "./AddRest";
import RestMarker from "./RestMarker";
// Icons
import markerUserIcon from "../img/marker-user.png";
import markerCenterIcon from "../img/marker-center.png";
//Firebase
const functions = require("firebase/functions");
// Map Style
const styles = require("../data/GoogleMapStyles.json");

export default function MapGoogle({
  center,
  userMarker,
  openInfoWindow,
  closeInfoWindow,
  activeRest,
  handleActiveRest,
  handleCenterChange,
  handleZoomChange,
  mapState,
  restaurants,
  handleNewData,
  userLocation,
}) {
  const { lat, lng } = userLocation;
  const [map, setMap] = useState();

  function onDragEnd() {
    handleCenterChange({
      lat: map.getCenter().lat(),
      lng: map.getCenter().lng(),
    });
  }

  function onZoomChanged() {
    if (map) {
      const zoom = map.getZoom();
      handleZoomChange(zoom);
    }
  }

  return (
    <div>
      <LoadScript
        id="script-loader"
        googleMapsApiKey={functions.config().foodieb.mapskey}
      >
        <GoogleMap
          onLoad={(map) => {
            setMap(map);
          }}
          id="restaurants-map"
          mapContainerStyle={{
            height: "100vh",
            width: "100%",
          }}
          zoom={15}
          center={center}
          onRightClick={(e) => openInfoWindow(e)}
          onDragEnd={onDragEnd}
          onZoomChanged={onZoomChanged}
          options={{
            disableDefaultUI: true,
            keyboardShortcuts: false,
            scaleControl: true,
            scrollWheel: true,
            draggable: true,
            styles: styles,
          }}
        >
          {/* Load user Marker */}
          {userMarker && (
            <Marker icon={{ url: markerUserIcon }} position={{ lat, lng }} />
          )}

          {/* Center Marker */}
          {center && center.lat !== lat && center.lng !== lng && (
            <Marker
              defaultClickable={false}
              icon={{ url: markerCenterIcon }}
              position={{ lat: center.lat, lng: center.lng }}
            />
          )}

          {/* Load Restaurant Markers */}
          {restaurants.map((r, id) => (
            <RestMarker
              key={id}
              position={{ lat: r.lat, lng: r.lng }}
              index={r.id}
              restaurant={r}
              activeRest={activeRest}
              handleActiveRest={handleActiveRest}
            />
          ))}

          {/* Load Add Restaurant InfoWindow on right click */}
          {mapState.isRestAddButtonDisplayed && (
            <InfoWindow
              position={{
                lat: mapState.newRestData.lat,
                lng: mapState.newRestData.lng,
              }}
              onCloseClick={closeInfoWindow}
            >
              <div>
                <h4>Add restaurant</h4>
                <p>{mapState.newRestData.address}</p>
                <AddRest
                  restaurants={restaurants}
                  newRestData={mapState.newRestData}
                  closeInfoWindow={closeInfoWindow}
                  handleNewData={handleNewData}
                />
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
