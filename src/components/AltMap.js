import React from "react";

// Components
import {GoogleMap, LoadScript, Marker, InfoWindow} from "@react-google-maps/api";
import RestMarker from "./RestMarker";
import AddRest from "./AddRest";

// Icons
import markerUser from "../img/marker-user.png";
import markerCenter from "../img/marker-center.png";

// Production
import runtimeEnv from "@mars/heroku-js-runtime-env";
// const env = runtimeEnv();
// const REACT_APP_G_API = env.REACT_APP_G_API;

const styles = require('../data/GoogleMapStyles.json');

export const AltMap = (props) => {
  console.log(props.center);

  const onDragEnd = () => {
    console.log('implement onDragEnd');
    // props.handleCenterChange( {
    //   lat: refs.map.getCenter().lat(),
    //   lng: refs.map.getCenter().lng()
    // });
  };

  return (
    <div>
      <LoadScript
        id="script-loader"
        googleMapsApiKey={process.env.REACT_APP_G_API}
      >
        <GoogleMap
          id='restaurants-map'
          mapContainerStyle={{
            height: "100vh",
            width: "100%"
          }}
          zoom={15}
          center={props.center}
          onRightClick={e => props.openInfoWindow(e)}
          onDragEnd={onDragEnd}
          options={{
            disableDefaultUI: true,
            keyboardShortcuts: false,
            scaleControl: true,
            scrollWheel: true,
            draggable: true,
            styles: styles
          }}
        >
          {/* Load user Marker */}
          {props.userMarker &&
          <Marker
            icon={{url: markerUser}}
            position={{lat: props.userLocation.lat, lng: props.userLocation.lng}}
          />
          }

          {/* Center Marker */}
          {props.center && ((props.center.lat !== props.userLocation.lat) && (props.center.lng !== props.userLocation.lng)) &&
          <Marker
            defaultClickable={false}
            icon={{url: markerCenter}}
            position={{lat: props.center.lat, lng: props.center.lng}}
          />
          }

          {/* Load Restaurant Markers */}
          {props.restaurants.map( (r, id) =>
            <RestMarker
              key={id}
              position={{lat: r.lat, lng: r.long}}
              index={r.id}
              restaurant={r}
              activeRest={props.activeRest}
              handleActiveRest={props.handleActiveRest}
            />)
          }

          {/* Load Add Restaurant InfoWindow on right click */}
          {props.mapState.isRestAddButtonDisplayed &&
          <InfoWindow
            position={{lat: props.mapState.newRestData.lat, lng: props.mapState.newRestData.lng}}
            onCloseClick={props.closeInfoWindow}
          >
            <div>
              <h4>Add restaurant</h4>
              <p>{props.mapState.newRestData.address}</p>
              <AddRest
                restaurants={props.restaurants}
                newRestData={props.mapState.newRestData}
                closeInfoWindow={props.closeInfoWindow}

                handleNewData={props.handleNewData}
              />
            </div>
          </InfoWindow>
          }

        </GoogleMap>
      </LoadScript>
    </div>
  )
};