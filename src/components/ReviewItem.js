// Import CSS
import '../css/style.css';

// Import Components
import React from 'react'
import {Grid, Image, Header, GridColumn,} from 'semantic-ui-react'
import { SingleRatingComponent } from "./RatingComponents";

export default class ReviewItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReviewLong: false,
      isFullReviewDisplayed: false,
      excerptReview: ''
    }
  }

  /* =====================
   *   Lifecycle Methods
  _* =====================
*/

  componentDidMount() {
    if (this.props.item.comment.length > 255) {
      const excerptReview = this.shortenString(this.props.item.comment, 255);
      this.setState({ isReviewLong: true, excerptReview: excerptReview });
    }
  };

  /* ===================
   *   Handler Methods
  _* ===================
*/

  handleReviewOpen = () => {
    this.setState(prevState => ({
      isFullReviewDisplayed: !prevState.isFullReviewDisplayed,
    }))
  };

  /* ==================
   *   Custom Methods
  _* ==================
*/

  shortenString = (str, maxLen, separator = ' ') => {
    if (str.length <= maxLen) return str;
    return str.substr(0, str.lastIndexOf(separator, maxLen)) + '... ';
  };

  render() {
    // Component Props
    const { item } = this.props;
    const { isReviewLong, excerptReview, isFullReviewDisplayed } = this.state;
    const genericReviewImgUrl = 'https://bit.ly/2VPaipa';

    return(
      <Grid centered>
        <GridColumn width={4} only='computer tablet'>
          <Image
            className='center-image'
            size='small'
            src={item.image_url ? item.image_url : genericReviewImgUrl}
          />
        </GridColumn>

        <GridColumn width={12} only='computer tablet'>
          <Header as='h4'>{item.name} <SingleRatingComponent rating={item.stars} /></Header>
          <div>
            {!isReviewLong ? item.comment : isFullReviewDisplayed ? item.comment : excerptReview}
            {isReviewLong ? isFullReviewDisplayed ?
              <a href='#' onClick={this.handleReviewOpen}><h5>show less</h5></a> :
              <a href='#' onClick={this.handleReviewOpen}>read more</a> :
              ''
            }
          </div>
        </GridColumn>

        <GridColumn textAlign='center' width={16} only='mobile'>
            <Header as='h4'>{item.name} <SingleRatingComponent rating={item.stars} /></Header>
            <div>
              {!isReviewLong ? item.comment : isFullReviewDisplayed ? item.comment : excerptReview}
              {isReviewLong ? isFullReviewDisplayed ?
                <a href='#' onClick={this.handleReviewOpen}> Show less</a> :
                <a href='#' onClick={this.handleReviewOpen}><p>read more</p></a> :
                ''
              }
            </div>
        </GridColumn>
      </Grid>
    )
  }
}