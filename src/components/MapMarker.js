import React from "react";
import { Marker, InfoWindow } from "react-google-maps";
import DataDisplay from "./DataDisplay";

export default class MapMarker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: false,
      activeId: 0
    }
  }

  handleMarkerClick = (e) =>  {
    // console.log('activeIndex', this.state.activeIndex);
    // console.log('id', id);
    let id = this.props.restaurant.id;
    this.props.handleActiveRest(id);
    // let activeRest = this.props.activeRest;
    // const newId = activeRest === id ? -1 : id;
    // this.setState({
    //   activeId: newId
    // });
    console.log('activeId', this.state.activeId);
  };

  render() {
    return (
      <div>
        <Marker
          position={{lat: this.props.position.lat, lng: this.props.position.lng}}
          title={'gTitle'}
          onClick={this.handleMarkerClick}
        >
          {this.state.activeId === this.props.activeRest && <InfoWindow onCloseClick={this.handleMarkerClick}>
            <div>
              {this.props.restaurant.restaurantName}
            </div>
          </InfoWindow>}
        </Marker>
      </div>
    );
  }
}