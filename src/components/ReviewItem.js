// Import Components

import React from 'react'
import { Item } from 'semantic-ui-react'
import { SingleRatingComponent } from "./RatingComponents";

export default class ReviewItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReviewShortened: true,
    }
  }

  shortenString = (str, maxLen, separator = ' ') => {
    if (str.length <= maxLen) return str;
    return str.substr(0, str.lastIndexOf(separator, maxLen));
  };

  render() {
    // Component Props
    const { item } = this.props;
    const genericPhotoUrl = 'https://react.semantic-ui.com/images/avatar/large/stevie.jpg';
    return(
      <Item>
        <Item.Image floated='left' size='tiny' src={item.photo_url ? item.photo_url : genericPhotoUrl}/>

        <Item.Content>
          <Item.Header as='a'>{item.name}</Item.Header>
          <SingleRatingComponent rating={item.stars} />
          <Item.Description>
            {item.comment.length > 255 ? this.shortenString(item.comment, 250) : item.comment}
            {this.state.isReviewShortened && <a href='#'> [...]</a>}
          </Item.Description>
        </Item.Content>
      </Item>
    )
  }
}