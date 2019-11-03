// Imports
import React from 'react'
// CSS
import '../css/style.css';
// Components
import { SingleRatingComponent } from "./RatingComponents";
// Dependencies
import {Grid, Image, Header, GridColumn,} from 'semantic-ui-react'

export default class ReviewItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReviewLong: false,
      isFullReviewDisplayed: false,
      excerptReview: ''
    };
    this.placeholderUrl = 'https://bit.ly/2VPaipa';
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
    const { item } = this.props;
    const { placeholderUrl, handleReviewOpen } = this;
    const { isReviewLong, excerptReview, isFullReviewDisplayed } = this.state;

    return(
      <Grid centered>
        <GridColumn width={4} only='computer tablet'>
          <Image
            className='center-image'
            size='small'
            src={item.image_url ? item.image_url : placeholderUrl}
          />
        </GridColumn>

        <GridColumn width={12} only='computer tablet'>
          <Header as='h4'>{item.name} <SingleRatingComponent rating={item.stars} /></Header>
          <div>
            {!isReviewLong ? item.comment : isFullReviewDisplayed ? item.comment : excerptReview}
            {isReviewLong ? isFullReviewDisplayed ?
              <p className='paragraph-link' onClick={handleReviewOpen}>show less</p> :
              <p className='paragraph-link' onClick={handleReviewOpen}>read more</p> :
              ''
            }
          </div>
        </GridColumn>

        <GridColumn textAlign='center' width={16} only='mobile'>
            <Header as='h4'>{item.name} <SingleRatingComponent rating={item.stars} /></Header>
            <div>
              {!isReviewLong ? item.comment : isFullReviewDisplayed ? item.comment : excerptReview}
              {isReviewLong ? isFullReviewDisplayed ?
                <p className='paragraph-link' onClick={handleReviewOpen}>show less</p> :
                <p className='paragraph-link' onClick={handleReviewOpen}>read more</p> :
                ''
              }
            </div>
        </GridColumn>
      </Grid>
    )
  }
}