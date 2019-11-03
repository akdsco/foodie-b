// Imports
import React from 'react'
// Images
import foodPlate from '../img/food-plate.jpg'
// CSS
import '../css/style.css';
// Components
import {AvgRatingComponent} from "./RatingComponents";
// Dependencies
import {Button, Icon, Item } from "semantic-ui-react";

const RestTitle = (props) => {
  const photo = props.item.streetViewURL ? props.item.streetViewURL : (props.item.details.photoUrl ? props.item.details.photoUrl : foodPlate);

  return(
    <Item>
      <Item.Image src={photo} size='tiny' floated='left'/>

      <Item.Content>
        <Item.Header as='a'>{props.item.restaurantName}</Item.Header>
        <Item.Meta>
          <span className='restaurant'>{props.item.address}</span>
        </Item.Meta>
        <Item.Extra>
          <AvgRatingComponent avgRating={props.avgRating}/>
          <Button className='more-info' size='mini' floated='right'>{props.active ? 'Less' : 'More Info'}<Icon name='dropdown'/></Button>
        </Item.Extra>
      </Item.Content>
    </Item>)
};

export default RestTitle