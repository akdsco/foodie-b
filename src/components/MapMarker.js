import React from "react";
import { Marker, InfoWindow } from "react-google-maps";

const MapMarker = (props) =>  {
  const { index } = props;

  const handleMarkerClick = () =>  {
    props.handleActiveRest(index);
  };

  return (
    <Marker
      position={{lat: props.position.lat, lng: props.position.lng}}
      onClick={handleMarkerClick}
      {...props}
    >
      {props.activeRest === props.index && <InfoWindow onCloseClick={handleMarkerClick}>
        <div>
          {props.restaurant.restaurantName}
        </div>
      </InfoWindow>}
    </Marker>
  );
};

export default MapMarker;