import React from 'react'
import { Image as ImageComponent, Item } from 'semantic-ui-react'

const ReviewItem = () => (
      <Item>
        <Item.Image size='tiny' src='https://react.semantic-ui.com/images/avatar/large/stevie.jpg' />

        <Item.Content>
          <Item.Header>Stevie Feliciano</Item.Header>
          <Item.Description>Review text goes here</Item.Description>
        </Item.Content>
      </Item>
)

export default ReviewItem