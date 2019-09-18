// Import Images
import fmjImg from '../img/fmj.jpg'

// Import Components
import React from 'react'
import {Button, Icon, Item } from "semantic-ui-react";
import {AvgRatingComponent} from "./RatingComponents";

const RestaurantItem = (props) => {
  const photo = props.item.photo ? props.item.photo : fmjImg;

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

export default RestaurantItem
