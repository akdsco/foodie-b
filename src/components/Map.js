/* global google */

// Import Components
import React from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import {compose, lifecycle, withProps} from "recompose";

// Import Images
import userLocation from '../img/user.png'

const _ = require("lodash");
const styles = require('../data/GoogleMapStyles.json');
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");

//TODO figure out what's influencing state and why can't map be dragged

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bounds: null,
      markers: [],
      center: {
        lat: 0,
        lng: 0
      },
      isMarkerShown: false
    }
  }

  showCurrentLocation = () => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState(prevState => ({
            center: {
              ...prevState.center,
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            isMarkerShown: true
          }))
        },
        (error) => {
          console.log(error);
          console.log('Error: The Geolocation service failed.');
          this.setState(prevState => ({
            center: {
              ...prevState.center,
              lat: 51.516126,
              lng: -0.081679
            },
            isMarkerShown: true
          }))
        }
      )
    }
  };

  componentDidMount() {
    this.showCurrentLocation()
  };

  render() {
    // Sourcing lat and lng from each restaurant in the file and creating map markers
    const restaurantMarkers = this.props.restaurantsList.map( restaurant =>
      <Marker key={restaurant.id} position={{ lat: restaurant.lat, lng: restaurant.long}} />
    );

    const Map = compose(
      withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBCwca9Qh9sLxHqQisOUHV62-Xth5iH0pI&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100vh` }} />,
        mapElement: <div style={{ height: `100%` }} />
      }),
      lifecycle({
        componentWillMount() {
          const refs = {};

          this.setState({
            bounds: null,
            center: {
              lat: 41.9, lng: -87.624
            },
            markers: [],
            onMapMounted: ref => {
              refs.map = ref;
            },
            onBoundsChanged: () => {
              this.setState({
                bounds: refs.map.getBounds(),
                center: refs.map.getCenter(),
              })
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

              this.setState({
                center: nextCenter,
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
        onBoundsChanged={props.onBoundsChanged}
        defaultZoom={15}
        center={{
          lat: props.currentLocation.lat,
          lng: props.currentLocation.lng
        }}
        defaultOptions={{
          disableDefaultUI: true,
          keyboardShortcuts: false,
          scaleControl: true,
          scrollWheel: true,
          styles: styles,
          draggable: true,
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
        {/* Loading user location if browser locates, else hardcoded value for London, City of */}
        {props.isMarkerShown &&
          <Marker
              icon={{url: userLocation}}
              position={{lat: props.currentLocation.lat, lng: props.currentLocation.lng}}
              onClick={props.onMarkerClick}
          />}

        {/* Loading Restaurants from a file - Hardcoded */}
        {restaurantMarkers}

        {/* Loading Google Places restaurants */}
        {props.markers.map((marker, index) =>
            <Marker key={index} position={marker.position} />
        )}
      </GoogleMap>
    );

    return(
        <Map
          isMarkerShown={this.state.isMarkerShown}
          currentLocation={this.state.center}
        />
    )
  }

}