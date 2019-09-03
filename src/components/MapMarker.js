import React from "react";
import { Marker, InfoWindow } from "react-google-maps";

export default class MapMarker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: false
    }
  }

  onMarkerClicked = (prevState) => {
    console.log('onMarkerClicked fired');
    this.setState({
      activeItem: !prevState.activeItem
    })
  };

  render() {
    return (
      <diV>
        <Marker
          position={{lat: this.props.position.lat, lng: this.props.position.lng}}
          onClick={this.onMarkerClicked}
        >
          {this.state.activeItem && <InfoWindow onCloseClick={this.state.onMarkerClicked}>
            <div>
              {this.props.restaurant.restaurantName}
            </div>
          </InfoWindow>}
        </Marker>
      </diV>
    );
  }
}