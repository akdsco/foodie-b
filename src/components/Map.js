/*global google*/

// Import Images
import userLocation from '../img/user.png'

// Import Components
import React from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow} from "react-google-maps";
import {compose, lifecycle, withProps} from "recompose";

const _ = require("lodash");
const styles = require('../data/GoogleMapStyles.json');
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");

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
    componentWillMount() {
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
          this.props.handleCenterChange(refs.map.getCenter());
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
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_CENTER}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Search here"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `27px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>

    {/* Loading user location Marker if browser locates, else hardcoded value for London, City of */}
    {props.isUserMarkerShown &&
      <Marker
        icon={{url: userLocation}}
        position={{lat: props.center.lat, lng: props.center.lng}}
      />
    }

    {/* TODO how can I create 'isOpen' switch for every Marker here (+ handler) ???? */}

    {/* Loading Restaurants from a JSON file - Hardcoded */}
    {props.restaurantsList.map( (r, id) =>
      <Marker
        key={id}
        position={{lat: r.lat, lng: r.long}}
        onClick={props.onToggleOpen}
      >
        {/*{console.log(props.isOpen)}*/}
        {props.isOpen && <InfoWindow onCloseClick={props.onToggleOpen}>
          <div>Test</div>
        </InfoWindow>}
      </Marker>
    )}

    {/* Loading Google Places restaurants */}
    {props.markers.map((marker, index) =>
      <Marker key={index} position={marker.position} />
    )}
  </GoogleMap>
);

export default class Map extends React.PureComponent {

  render() {
    console.log(this.props.restaurantsAPI);
    return(
      <MapConst
        restaurantsList={this.props.restaurantsList}
        center={this.props.center}
        handleCenterChange={this.props.handleCenterChange}
        restaurantsAPI={this.props.restaurantsAPI}
      />
    )
  }

}