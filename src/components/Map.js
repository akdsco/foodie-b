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

const MapConst = compose(
    withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBCwca9Qh9sLxHqQisOUHV62-Xth5iH0pI&v=3.exp&libraries=places,geometry,drawing",
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
            lat: 1,
            lng: 1
          },
          isUserMarkerShown: false,
          isOpen: false,
          markers: [],
          locateUser: () => {
            if(navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                position => {
                  console.log('User Successfully located');
                  this.setState(prevState => ({
                    center: {
                      ...prevState.center,
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                    },
                    isUserMarkerShown: true
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
                    isUserMarkerShown: true
                  }))
                }
              )
            }
          },
          onMapMounted: ref => {
            this.state.locateUser();
            refs.map = ref;
          },

          onDragEnd: () => {
            this.setState({
              bounds: refs.map.getBounds(),
              center: refs.map.getCenter()
            });
          },
          onSearchBoxMounted: ref => {
            refs.searchBox = ref;
          },
          onToggleOpen: (prevState) => {
            console.log('onToggleOpen fired');
            this.setState({
              isOpen: !prevState.isOpen
            })
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
            refs.map.fitBounds(bounds);
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
          styles: styles,
          draggable: true
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
    // Sourcing lat and lng from each restaurant in the file and creating map markers

    // TODO write code that will check if restaurants are in bound and generate only ones that are ?

    // const restaurantMarkers = this.props.restaurantsList.map( restaurant =>
    //   <Marker key={restaurant.id} position={{ lat: restaurant.lat, lng: restaurant.long}} />
    // );

    const restaurantMarkers = this.props.restaurantsList.map( restaurant =>
      <Marker
        position={{
          lat: restaurant.lat,
          lng: restaurant.long
        }}
        // onClick={props.onToggleOpen}
      >
        {/*{props.isOpen && <InfoWindow onCloseClick={props.onToggleOpen}>*/}
        {/*  <FaAnchor />*/}
        {/*</InfoWindow>}*/}
      </Marker>
    );

    return(
        <MapConst
          restaurantsList={this.props.restaurantsList}
        />
    )
  }

}