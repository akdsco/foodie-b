// Imports
import React from 'react';
// Images
import markerUser from '../img/marker-user.png'
import markerCenter from '../img/marker-center.png'
// CSS
import '../css/style.css';
// Components
import AddRest from "./AddRest";
import RestMarker from "./RestMarker";
import {AltMap} from "./AltMap";
// Dependencies
import Geocode from "react-geocode";
import { Button, Icon } from "semantic-ui-react";
import {compose, lifecycle, withProps} from "recompose";
import {withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow} from "react-google-maps";
import runtimeEnv from "@mars/heroku-js-runtime-env";
// Map Styles
const styles = require('../data/GoogleMapStyles.json');

// const env = runtimeEnv();
// const REACT_APP_G_API = env.REACT_APP_G_API;

const MapConst = compose(
  withProps({
    googleMapURL: "google-maps-api/maps/api/js?key=" + process.env.REACT_APP_G_API + "&v=3.exp&libraries=places,geometry,drawing",
    loadingElement: <div className='loadingElement'/>,
    containerElement: <div className='containerElement'/>,
    mapElement: <div className='mapElement' />
  }),
  lifecycle({
    componentDidMount() {
      const refs = {};

      this.setState({
        onMapMounted: ref => {
          refs.map = ref;
        },
        onDragEnd: () => {
          this.props.handleCenterChange( {
            lat: refs.map.getCenter().lat(),
            lng: refs.map.getCenter().lng()
          });
        },
        onZoomChanged: () => {
          let zoom = refs.map.getZoom();
          this.props.handleZoomChange(zoom);
        }
      })
    },
  }),
  withScriptjs,
  withGoogleMap)((props) =>
  <GoogleMap
    ref={props.onMapMounted}
    onDragEnd={props.onDragEnd}
    onRightClick={e => props.openInfoWindow(e)}
    onZoomChanged={props.onZoomChanged}
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
);

export default class Map extends React.PureComponent {
  state = {
    isRestAddButtonDisplayed: false,
    isRestAddModalOpen: false,
    newRestData: {
      address: '',
      lat: '',
      lng: ''
    }
  };

  /* ===================
   *   Handler Methods
  _* ===================
*/

  closeInfoWindow = () => {
    this.setState({
      isRestAddButtonDisplayed: false,
      newRestData: {
        address: '',
        lat: '',
        lng: ''
      }
    })};

  openInfoWindow = (e) => {
    let restData = {};

    Geocode.setApiKey(process.env.REACT_APP_G_API);
    Geocode.fromLatLng(e.latLng.lat(), e.latLng.lng()).then(
      response => {
        const address = response.results[0].formatted_address;
        restData = {
          address: address,
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        };
        this.setState({
          newRestData: restData,
          isRestAddButtonDisplayed: true
        })
      },
      error => {
        console.error(error);
      }
    )
  };

  render() {
    const { userLocation, restaurants, center, activeRest, handleRestSearch, flags,
            handleActiveRest, handleCenterChange, handleNewData, handleZoomChange } = this.props;
    const { closeInfoWindow, openInfoWindow, state } = this;

    return(
      <div>
        <AltMap
          restaurants={restaurants}
          center={center}
          userLocation={userLocation}
          userMarker={flags.isUserMarkerShown}
          activeRest={activeRest}
          mapState={state}

          closeInfoWindow={closeInfoWindow}
          openInfoWindow={openInfoWindow}

          handleNewData={handleNewData}
          handleZoomChange={handleZoomChange}
          handleActiveRest={handleActiveRest}
          handleCenterChange={handleCenterChange}
        />
        <Button className='search-toggle-button' toggle active={flags.isRestSearchAllowed} onClick={handleRestSearch}>
          {flags.isRestSearchAllowed &&
          <p><Icon name='check square' />Search as I move the map</p>}
          {!flags.isRestSearchAllowed &&
          <p><Icon name='square outline' />Search as I move the map</p>}
        </Button>

      </div>
    )
  }
}