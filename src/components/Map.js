// Import Data
import restaurantsARR from '../data/restaurants'

// Import Components
import React from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps";
import {compose, withProps} from "recompose";

const styles = require('../data/GoogleMapStyles.json');

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: restaurantsARR,
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
    const restaurantMarkers = this.state.restaurants.map( restaurant => {
          // find out lat and lng info for each restaurant item
          // console.log(restaurant);
          return <Marker key={restaurant.id} position={{ lat: restaurant.lat, lng: restaurant.long}} />
        }
    );

    const Map = compose(
      withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBCwca9Qh9sLxHqQisOUHV62-Xth5iH0pI&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100vh` }} />,
        mapElement: <div style={{ height: `100%` }} />
      }),
      withScriptjs,
      withGoogleMap
    )((props) =>
      <GoogleMap
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
          styles: styles
        }}
      >
        {props.isMarkerShown &&
          <Marker
              position={{lat: props.currentLocation.lat, lng: props.currentLocation.lng}}
              onClick={props.onMarkerClick}
          />}
        {restaurantMarkers}
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

export default Map