/*global google*/

// Import Images
import userLocation from '../img/user.png'

// Import Components
import React from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps";
import {compose, lifecycle, withProps} from "recompose";
import MapMarker from "./MapMarker";

// const _ = require("lodash");
const styles = require('../data/GoogleMapStyles.json');

// TODO implement - records in DataDisplay and on Map update as you drag map around

const MapConst = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_G_HTTP_RESTRICTED_API + "&v=3.exp&libraries=places,geometry,drawing",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100vh` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  lifecycle({
    componentDidMount() {
      const refs = {};

      this.setState({
        bounds: null,
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onDragEnd: () => {
          this.props.handleCenterChange( {
            lat: refs.map.getCenter().lat(),
            lng: refs.map.getCenter().lng()
          });
          this.setState({
            bounds: refs.map.getBounds()
          });
        },
      })
    },
  }),
  withScriptjs,
  withGoogleMap)((props) =>
  <GoogleMap
    ref={props.onMapMounted}
    onDragEnd={props.onDragEnd}
    onClick={e => {console.log(e.latLng.lat(),e.latLng.lng())}}
    // onClick={e => console.log(e)}
    defaultZoom={15}
    center={props.center}
    defaultOptions={{
      disableDefaultUI: true,
      keyboardShortcuts: false,
      scaleControl: true,
      scrollWheel: true,
      draggable: true,
      styles: styles
    }}
  >

    {/* Loading user Marker if browser locates, else hardcoded value for London, City of*/}
    {props.userMarker &&
      <Marker
        icon={{url: userLocation}}
        position={{lat: props.userLocation.lat, lng: props.userLocation.lng}}
      />
    }

    {/* Loading Restaurant Markers */}
    {props.restaurants.map( (r, id) =>
      <MapMarker
        key={id}
        position={{lat: r.lat, lng: r.long}}
        index={r.id}
        restaurant={r}
        activeRest={props.activeRest}
        handleActiveRest={props.handleActiveRest}
      />)
    }

  </GoogleMap>
);

export default class Map extends React.PureComponent {

  render() {
    const { userMarker, userLocation, restaurants, center, activeRest, handleActiveRest, handleCenterChange } = this.props;
    return(
      <MapConst
        userMarker={userMarker}
        userLocation={userLocation}
        restaurants={restaurants}
        center={center}
        activeRest={activeRest}

        handleActiveRest={handleActiveRest}
        handleCenterChange={handleCenterChange}
      />
    )
  }
}