// Import Components

import React from 'react'
import { Item } from 'semantic-ui-react'
import { SingleRatingComponent } from "./RatingComponents";

export default class ReviewItem extends React.Component {

  render() {
    // Component Props
    const { item } = this.props;

    return(
      <Item>
        {/*<Item.Image size='tiny' src='https://react.semantic-ui.com/images/avatar/large/stevie.jpg'/>*/}

        <Item.Content>
          <Item.Header as='a'>{item.name}</Item.Header>
          <SingleRatingComponent rating={item.stars} />
          <Item.Description>{item.comment}</Item.Description>
        </Item.Content>
      </Item>
    )
  }
}