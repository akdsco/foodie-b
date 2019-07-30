// Import Images
import fmjImg from '../img/fmj.jpg'

// Import Components
import React from 'react'
import {Button, Icon, Item, Label} from "semantic-ui-react";
import {AvgRatingComponent} from "./RatingComponents";
import Flag from "semantic-ui-react/dist/commonjs/elements/Flag/index";
import Reviews from "./old-code/Reviews";

const RestaurantItem = (props) => (
      <Item>
        <Item.Image src={fmjImg} size='small' floated='left'/>

        <Item.Content>
          <Item.Header as='a'>{props.item.restaurantName}</Item.Header> <Flag name={props.item.flag} />
          <Item.Meta>
            <span className='restaurant'>{props.item.address}</span>
          </Item.Meta>
          <Item.Description>{props.item.desc}</Item.Description>
          <Item.Extra>
            <Label>
              <AvgRatingComponent avgRating={props.avgRating}/>
            </Label>
            <Button size='tiny' floated='right'>More Info <Icon name='dropdown'/></Button>
          </Item.Extra>
        </Item.Content>
      </Item>
)

export default RestaurantItem
