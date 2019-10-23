// Import Components

import React from "react";
import { Marker, InfoWindow } from "react-google-maps";
import {Card, Header, Icon, Image, Label} from "semantic-ui-react";

const MapMarker = (props) =>  {
  const { index } = props;

  const handleMarkerClick = () =>  {
    props.handleActiveRest(index);
  };

  return (
    <div>
      {props.activeRest !== props.index &&
      <Marker
        position={{lat: props.position.lat, lng: props.position.lng}}
        onClick={handleMarkerClick}
        {...props}
      />}
      {props.activeRest === props.index &&
      <InfoWindow
        position={{lat: props.position.lat, lng: props.position.lng}}
        onCloseClick={handleMarkerClick}>
        <div>
          <Header as='h3' textAlign='center'>
            {props.restaurant.restaurantName}
          </Header>
          <Card>
            <Image src={props.restaurant.isFromFile ? props.restaurant.details.photoUrl : props.restaurant.streetViewURL} wrapped ui={false} />
            <Card.Content>
              <Card.Meta>
                <Label tag color={props.restaurant.open ? 'green' : 'red'} size='small'>
                  {props.restaurant.open ? 'Open' : 'Closed'}
                </Label>
              </Card.Meta>
              <Card.Description>
                {props.restaurant.address}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Icon name='users' />
              {props.restaurant.numberOfReviews} Reviews
            </Card.Content>
          </Card>
        </div>
      </InfoWindow>}
    </div>
  );
};

export default MapMarker;