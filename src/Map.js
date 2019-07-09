import React from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps";
const styles = require('./GoogleMapStyles.json');

const MapComponent = withScriptjs(withGoogleMap(props =>
  <GoogleMap
      defaultZoom={15}
      defaultCenter={{
        lat: 51.516858,
        lng: -0.081121
      }}
      defaultOptions={{
        disableDefaultUI: true,
        keyboardShortcuts: false,
        scaleControl: true,
        scrollWheel: true,
        styles: styles
      }}
  >
    <Marker
        position={{ lat: 51.516858, lng: -0.081121 }}
    />
  </GoogleMap>
));


class Map extends React.PureComponent {
  render() {
    return(
        <MapComponent
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBCwca9Qh9sLxHqQisOUHV62-Xth5iH0pI&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100vh` }} />}
            mapElement={<div style={{ height: `100%` }} />}
        />
    )
  }

}

export default Map