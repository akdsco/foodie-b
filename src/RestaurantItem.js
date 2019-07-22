import React from 'react'
import {Item, Label } from 'semantic-ui-react'
import {AvgRatingComponent} from "./AvgRatingComponent";
import Flag from "semantic-ui-react/dist/commonjs/elements/Flag";
import Reviews from "./Reviews";

const RestaurantItem = (props) => (
      <Item>
        <Item.Image src='./fmj.jpg' />

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
            <Reviews item={props.item} />
          </Item.Extra>
        </Item.Content>
      </Item>
)

export default RestaurantItem
