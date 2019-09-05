/*global google*/

// Import Images
import userLocation from '../img/user.png'

// Import Components
import React from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps";
import {compose, lifecycle, withProps} from "recompose";
import MapMarker from "./MapMarker";
import DataDisplay from "./DataDisplay";

const _ = require("lodash");
const styles = require('../data/GoogleMapStyles.json');

// TODO implement - search that returns both new markers and updates DataDisplay with new records and 'holds' JSON file records
// TODO implement - DataDisplay only shows records that are visible as Markers on Map
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
        isUserMarkerShown: false,
        isOpen: false,
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
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          this.props.handleCenterChange(nextCenter);
          this.setState({
            // center: nextCenter,
            markers: nextMarkers,
          });
          // refs.map.fitBounds(bounds);
        },
      })
    },
  }),
  withScriptjs,
  withGoogleMap)((props) =>
  <GoogleMap
    ref={props.onMapMounted}
    // onBoundsChanged={props.onBoundsChanged}
    onDragEnd={props.onDragEnd}
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
        restaurant={r}
        activeRest={props.activeRest}
        handleActiveRest={props.handleActiveRest}
      />)
    }

  </GoogleMap>
);

export default class Map extends React.PureComponent {

  render() {
    return(
      <MapConst
        userMarker={this.props.userMarker}
        userLocation={this.props.userLocation}
        restaurants={this.props.restaurants}
        normalizedRest={this.props.normalizedRest}
        center={this.props.center}
        activeRest={this.props.activeRest}
        handleActiveRest={this.props.handleActiveRest}
        handleCenterChange={this.props.handleCenterChange}
      />
    )
  }
}