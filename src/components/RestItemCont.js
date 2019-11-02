// Import CSS
import '../css/style.css';

// Import Components
import React from 'react';
import ReviewItem from "./ReviewItem";
import {AddReviewModal, MoreReviews} from "./Modals";
import {LeftColumnPlaceholder, RightColumnPlaceholder, ReviewsPlaceholder, MobilePlaceholder} from "./Placeholders";
import {Container, GridColumn, Grid, Image, Icon, Segment} from "semantic-ui-react";

export default class RestItemCont extends React.Component {
  state = {
      loadingData: true,
      content: {
        reviews: [],

        openingTimes: [],
        phoneNum: '',
        photoUrl: '',
        staticMapUrl: '',
      },
    };
  placeholderUrl = 'https://bit.ly/2JnrFZ6';


  componentDidMount() {
    setTimeout(() => this.loadContent(), 1250);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // updating local state of reviews if user adds new one (re-rendering reviews)
    if(this.props.restaurant.details.reviews.length !== this.state.content.reviews.length) {
      this.setState(prevState => ({
        content: {
          ...prevState.content,
          reviews: this.getRestReviews(),
        }
      }))
    }
  }

  loadContent = () => {
    let content = {
        reviews: this.getRestReviews(),
        openingTimes: this.getRestOpeningTimes(),
        phoneNum: this.getRestPhoneNum(),
        photoUrl: this.getRestPhotoUrl(),
        staticMapUrl: this.getGoogleMapStaticUrl()
      };

    this.setState({
      loadingData: false,
      content
    });
  };

  getRestReviews = () => {
    let reviews = [];
    let counter = -1;
    const { restaurant } = this.props;

    if (restaurant.details) {
      reviews = restaurant.details.reviews ?
        restaurant.details.reviews.map(review => {
          counter++;
          return(
            <Grid key={counter}>
              <Grid.Row centered>
                <GridColumn width={15}>
                  <ReviewItem item={review} fromFile={restaurant.isFromFile} />
                </GridColumn>
              </Grid.Row>
            </Grid>)
        })
        : null;
    }

    return reviews;
  };

  getRestOpeningTimes = () => {
    let openingTimes = [];
    const { restaurant } = this.props;

    if(restaurant.details) {
      let counter = -1;
      if(restaurant.details.openingHours) {
        openingTimes = restaurant.details.openingHours.weekday_text.map( (day) => {
          counter++;
          return(<p key={counter} className='mb-2'>{day}</p>)}
        );
      }
    }
    return openingTimes;
  };

  getRestPhoneNum = () => {
    let number = '';
    const { restaurant } = this.props;

    if(restaurant.details) {
      if(restaurant.details.phoneNumber) {
        number += restaurant.details.phoneNumber;
      }
    }

    return number;
  };

  getRestPhotoUrl = () => {
    let url = this.placeholderUrl;
    const { restaurant } = this.props;

    if(restaurant.details) {
      let data = restaurant.details;

      if(data.photos) {
        // noinspection JSUnusedLocalSymbols
        let photoRef = data.photos[1] ? data.photos[1].photo_reference : (data.photos[0] ? data.photos[0].photo_reference : '');
        url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=' + photoRef + '&key=' + process.env.REACT_APP_G_API;
      } else if (typeof data.photoUrl !== 'undefined' && data.photoUrl !== '') {
        url = data.photoUrl;
      }
    }
    return url
  };

  getGoogleMapStaticUrl = () => {
    const { restaurant } = this.props;
    return 'https://maps.googleapis.com/maps/api/staticmap?center='+ restaurant.lat + ',' + restaurant.long + '&zoom=16&size=640x480&markers=color:red%7Clabel:Bronco%7C'+ restaurant.lat + ',' + restaurant.long + '&key=' + process.env.REACT_APP_G_API
  };

  getOpeningHours = () => {
    // const today = new Date();
    // const { restaurant } = this.props;
    // let openingHours = '';
    //
    // if(restaurant.details) {
    //   openingHours = restaurant.details.openingHours ? 'api' : 'file'
    // }
    // console.log(openingHours);
    // return openingHours;
  };


  render() {
    const { reviews, openingTimes, phoneNum, photoUrl, staticMapUrl } = this.state.content;
    const { restaurant, handleNewData, windowWidth } = this.props;
    const { loadingData } = this.state;

    return(
      <Container className='container-accordion'>
        <Grid>

          {/* Restaurant information */}

          <Grid.Row columns={2} only='computer tablet'>
            <GridColumn width={7} >
              {/*  Left Column - Data  */}
              {loadingData ?
                <LeftColumnPlaceholder/>
                :
                <div>
                  <div key={0} className='mb-1'><Icon name='phone'/><a href={'tel:' + phoneNum}>{phoneNum}</a></div>
                  <div key={1} className='mb-2'><Icon name='linkify' /><a href={restaurant.details && restaurant.details.link}>Visit Website</a></div>
                  <div key={2}><h4 className='mb-2'>Opening Times</h4> {openingTimes}</div>
                </div>
              }
            </GridColumn>
            <GridColumn width={9}>
              {/*Right Column - Photo */}
              {loadingData ?
                <Segment>
                  <RightColumnPlaceholder/>
                </Segment>
                :
                <div>
                  <Image src={photoUrl} fluid />
                </div>
              }
            </GridColumn>
          </Grid.Row>

          {/* Restaurant information - Mobile Screens */}

          {windowWidth < 768 &&
          loadingData ?
            <MobilePlaceholder />
          :
            <Grid.Row columns={2} only='mobile'>
              <GridColumn>
                <div className='my-2'>
                  <Icon name='phone'/><a className='mr-2' href={'tel:' + phoneNum}>{phoneNum}</a>
                  <Icon name='linkify'/><a href={restaurant.details && restaurant.details.link}>Visit Website</a>
                </div>
              </GridColumn>
              <GridColumn textAlign='center'>
                <div className='my-2'>
                  <p>Open today: 7am - 9pm</p>
                </div>
              </GridColumn>
              <GridColumn width={16}>
                <Image src={staticMapUrl} fluid/>
              </GridColumn>
            </Grid.Row>
          }

          {/* Reviews */}

          <Grid.Row>
            <GridColumn>
              {loadingData ?
                <ReviewsPlaceholder amount={restaurant.isFromFile ? restaurant.details.reviews.length : 5}/>
                :
                <div>
                  <h3>Most helpful reviews</h3>
                  {reviews}
                </div>
              }
            </GridColumn>
          </Grid.Row>

          {/* More Reviews and Add Review Modals */}

          <Grid.Row>
            <GridColumn className='restaurant-item-buttons'>
              {restaurant.details &&
                <MoreReviews />
              }
              {restaurant.details &&
                <AddReviewModal
                  photoUrl={photoUrl}
                  restaurant={restaurant}
                  handleNewData={handleNewData}
                />
              }
            </GridColumn>
          </Grid.Row>

        </Grid>
      </Container>
    )
  }
}
