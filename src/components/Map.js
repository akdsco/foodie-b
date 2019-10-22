// Import Images
import userLocationMarker from '../img/user.png'

// Import Components
import React from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow} from "react-google-maps";
import {compose, lifecycle, withProps} from "recompose";
import MapMarker from "./MapMarker";
import AddRestaurant from "./AddRestaurant";

// const _ = require("lodash");
const styles = require('../data/GoogleMapStyles.json');

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

    {/* Loading user Marker if browser locates, else hardcoded value for London, City of*/}
    {props.userMarker &&
      <Marker
        icon={{url: userLocationMarker}}
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

    {props.mapState.isRestAddButtonDisplayed &&
      <InfoWindow
        position={{lat: props.mapState.infoWindowCoords.lat, lng: props.mapState.infoWindowCoords.lng}}
        onCloseClick={props.closeInfoWindow}
      >
        <div>
          <h4>Would you like to <br/>add new Restaurant?</h4>
          <AddRestaurant
            restaurants={props.restaurants}
            restaurantCoords={props.mapState.infoWindowCoords}
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
    infoWindowCoords: {}
  };

  closeInfoWindow = () => {
    this.setState({
      isRestAddButtonDisplayed: false,
      infoWindowCoords: {}
    })};

  openInfoWindow = (e) => {
    this.setState({
      infoWindowCoords: {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      },
      isRestAddButtonDisplayed: true
    });
  };

  render() {
    const { userMarker, userLocation, restaurants, center, activeRest,
            handleActiveRest, handleCenterChange, handleNewData,handleZoomChange } = this.props;
    const { closeInfoWindow, openInfoWindow, state } = this;

    return(
      <div>
        <MapConst
          userMarker={userMarker}
          userLocation={userLocation}
          restaurants={restaurants}
          center={center}
          activeRest={activeRest}
          mapState={state}

          closeInfoWindow={closeInfoWindow}
          openInfoWindow={openInfoWindow}

          handleNewData={handleNewData}
          handleZoomChange={handleZoomChange}
          handleActiveRest={handleActiveRest}
          handleCenterChange={handleCenterChange}
        />
      </div>

    )
  }
}