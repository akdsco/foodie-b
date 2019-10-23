// Import Components
import React from 'react'
import { Item } from 'semantic-ui-react'
import { SingleRatingComponent } from "./RatingComponents";

export default class ReviewItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReviewLong: false,
      excerptReview: ''
    }
  }

  /* =====================
   *   Lifecycle Methods
  _* =====================
*/

  componentDidMount() {
    if (this.props.item.comment.length > 255) {
      const excerptReview = this.shortenString(this.props.item.comment, 250);
      this.setState({ isReviewLong: true, excerptReview: excerptReview });
    }
  };

  /* ===================
   *   Handler Methods
  _* ===================
*/

  handleReviewOpen = () => {
    console.log('trying to open review');

  };

  /* ==================
   *   Custom Methods
  _* ==================
*/

  shortenString = (str, maxLen, separator = ' ') => {
    if (str.length <= maxLen) return str;
    this.setState({isReviewLong: false});
    return str.substr(0, str.lastIndexOf(separator, maxLen));
  };

  render() {
    // Component Props
    const { item } = this.props;
    const { isReviewLong } = this.state;
    const genericReviewImgUrl = 'https://bit.ly/2VPaipa';

    return(
      isReviewLong === true ?
      <Item>
        {this.props.fromFile ?
          <Item.Image floated='left' size='tiny'
                      src={item.image_url ? item.image_url : genericReviewImgUrl} circular /> :
          <Item.Image floated='left' size='tiny'
                      src={item.image_url ? item.image_url : genericReviewImgUrl}/>
        }

        <Item.Content>
          <Item.Header as='a'>{item.name}</Item.Header>
          <SingleRatingComponent rating={item.stars} />
          <Item.Description>
            {this.state.isReviewLong? this.state.excerptReview : item.comment}
            {this.state.isReviewLong && <a href='#' onClick={this.handleReviewOpen}> [...]</a>}
          </Item.Description>
        </Item.Content>
      </Item>
   :
    <Item>
      {this.props.fromFile ?
        <Item.Image floated='left' size='tiny'
                    src={item.image_url ? item.image_url : genericReviewImgUrl} circular /> :
        <Item.Image floated='left' size='tiny'
                    src={item.image_url ? item.image_url : genericReviewImgUrl}/>
      }

      <Item.Content>
        <Item.Header as='a'>{item.name}</Item.Header>
        <SingleRatingComponent rating={item.stars} />
        <Item.Description>
          {this.state.isReviewLong? this.state.excerptReview : item.comment}
          {this.state.isReviewLong && <a href='#' onClick={this.handleReviewOpen}> [...]</a>}
        </Item.Description>
      </Item.Content>
    </Item>
    )
  }
}