import React from 'react'
import { Button, Icon, Image, Item, Label } from 'semantic-ui-react'
import RatingComponent from "./RatingComponent";
import Flag from "semantic-ui-react/dist/commonjs/elements/Flag";
import Reviews from "./Reviews";

// const paragraph = <Image src='/images/wireframe/short-paragraph.png' />
const paragraph = 'Best place to visit for local dishes with veggies and organic meat.';

const RestaurantItemInfo = () => (
      <Item>
        <Item.Image src='./fmj.jpg' />

        <Item.Content>
          <Item.Header as='a'>Farmer J</Item.Header> <Flag name='gb' />
          <Item.Meta>
            <span className='restaurant'>120 Leadenhall St, London</span>
          </Item.Meta>
          <Item.Description>{paragraph}</Item.Description>
          <Item.Extra>
            <Label>
              <RatingComponent/>
            </Label>
            <Label>vegan</Label>
            <Reviews />
          </Item.Extra>
        </Item.Content>
      </Item>
)

export default RestaurantItemInfo
