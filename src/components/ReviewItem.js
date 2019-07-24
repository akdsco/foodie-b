// Import Components

import React from 'react'
import { Item } from 'semantic-ui-react'
import { SingleRatingComponent } from "./RatingComponents";

export default class ReviewItem extends React.Component {

  render() {
    return(
      <Item>
        <Item.Image size='tiny' src='https://react.semantic-ui.com/images/avatar/large/stevie.jpg'/>

        <Item.Content>
          <Item.Header as='a'>{this.props.item.name}</Item.Header>
          <SingleRatingComponent rating={this.props.item.stars} />
          <Item.Description>{this.props.item.comment}</Item.Description>
        </Item.Content>
      </Item>
    )
  }
}