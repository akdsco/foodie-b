// Import Components
import React from "react";
import { Marker, InfoWindow } from "react-google-maps";
import {Card, Header, Icon, Image, Label} from "semantic-ui-react";

const RestMarker = (props) =>  {
  const { index, restaurant, activeRest, position } = props;

  const handleMarkerClick = () =>  {
    props.handleActiveRest(index);
  };

  return (
    <div>
      {activeRest !== index &&
      <Marker
        position={{lat: position.lat, lng: position.lng}}
        onClick={handleMarkerClick}
        {...props}
      />}
      {activeRest === index &&
      <InfoWindow
        position={{lat: position.lat, lng: position.lng}}
        onCloseClick={handleMarkerClick}>
        <div>
          <Header as='h3' textAlign='center'>
            {restaurant.restaurantName}
          </Header>
          <Card>
            <Image src={restaurant.isFromFile ?
              restaurant.details.photoUrl :
              restaurant.streetViewURL} wrapped ui={false} />
            <Card.Content>
              <Card.Meta>
                <Label tag color={restaurant.open ? 'green' : 'red'} size='small'>
                  {restaurant.open ? 'Open Now' : 'Closed'}
                </Label>
              </Card.Meta>
              <Card.Description>
                {restaurant.address}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Icon name='users' />
              {restaurant.numberOfReviews} Reviews
            </Card.Content>
          </Card>
        </div>
      </InfoWindow>}
    </div>
  );
};

export default RestMarker;