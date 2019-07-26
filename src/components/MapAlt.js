import React from 'react'
const { compose, withProps, withStateHandlers } = require("recompose");
const { withScriptjs, withGoogleMap, GoogleMap, Marker} = require("react-google-maps");
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");

const MapAlt = compose(
    withProps({
      googleMapURL:"https://maps.googleapis.com/maps/api/js?key=AIzaSyBCwca9Qh9sLxHqQisOUHV62-Xth5iH0pI&v=3.exp&libraries=geometry,drawing,places",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `100vh` }} />,
      mapElement: <div style={{ height: `100%` }} />,
      center: { lat: 25.03, lng: 121.6 }
    }),
    withStateHandlers(() => ({
  isOpen: false,
}), {
  onToggleOpen: ({ isOpen }) => () => ({
    isOpen: !isOpen,
  })
}),
    withScriptjs,
    withGoogleMap
)(props =>
    <GoogleMap
        defaultZoom={5}
        defaultCenter={props.center}
    >
      <InfoBox
          // defaultPosition={new google.maps.LatLng(props.center.lat, props.center.lng)}
          options={{ closeBoxURL: ``, enableEventPropagation: true }}
      >
        <div style={{ backgroundColor: `yellow`, opacity: 0.75, padding: `12px` }}>
          <div style={{ fontSize: `16px`, fontColor: `#08233B` }}>
            Hello, Taipei!
          </div>
        </div>
      </InfoBox>
      <Marker
          position={{ lat: 22.6273, lng: 120.3014 }}
          onClick={props.onToggleOpen}
      >
        {props.isOpen && <InfoBox
            onCloseClick={props.onToggleOpen}
            options={{ closeBoxURL: ``, enableEventPropagation: true }}
        >
          <div style={{ backgroundColor: `yellow`, opacity: 0.75, padding: `12px` }}>
            <div style={{ fontSize: `16px`, fontColor: `#08233B` }}>
              Hello, Kaohsiung!
            </div>
          </div>
        </InfoBox>}
      </Marker>
    </GoogleMap>
);

export default MapAlt