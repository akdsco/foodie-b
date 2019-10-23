// Import Images
import fmjImg from '../img/fmj.jpg'

// Import Components
import React from 'react'
import {Button, Icon, Item } from "semantic-ui-react";
import {AvgRatingComponent} from "./RatingComponents";

const RestaurantTitle = (props) => {
  // const photo = props.item.streetViewURL ? props.item.streetViewURL : (props.item.details.photoUrl ? props.item.details.photoUrl : fmjImg);
  const photo = props.item.streetViewURL ? props.item.streetViewURL : fmjImg;

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
          <Button size='mini' floated='right'>More Info <Icon name='dropdown'/></Button>
        </Item.Extra>
      </Item.Content>
    </Item>)
};

export default RestaurantTitle