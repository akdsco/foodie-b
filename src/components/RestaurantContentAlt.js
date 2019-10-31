// Import CSS
import '../css/style.css';

// Import Components
import React from 'react';
import ReviewItem from "./ReviewItem";
import AddReview from "./AddReview";
import {LeftColumnPlaceholder, RightColumnPlaceholder, ReviewsPlaceholder} from "./Placeholders";
import {Container, GridColumn, Grid, Image, Button, Icon, Modal, Header, Segment} from "semantic-ui-react";

// TODO: rewrite this component, use state to hold all the data sourced from API, create one big function for all the data from API
//  source it and update state. Do it when component mounts. Before that display placeholders for everything.

export default class RestaurantContentAlt extends React.Component {
  state = {
      addReviewModalOpen: false,
      loadMoreReviewModalOpen: false,
      loadingData: true,
      loadingImg: true,
      content: {
        reviews: [],
        openingTimes: [],

      },
    };
  placeholderUrl = 'https://bit.ly/2JnrFZ6';


  componentDidMount() {
    if(this.props.restaurant.isFromFile) {
      this.setState({loadingImg: false});
    }

    // this.setState({
    //   content: {
    //     reviews: this.getRestReviews(),
    //     openingTimes: this.getRestOpenTime(),
    //     phoneNum: this.getRestPhoneNum(),
    //     restPhotoUrl: this.getRestPhotoUrl(),
    //
    //   }
    // })
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

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

  getRestOpenTime = () => {
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
        // console.log('data.photoUrl', url);
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
    const { handleChange, getRestPhoneNum, getRestOpenTime, getRestPhotoUrl, getRestReviews, getGoogleMapStaticUrl } = this;
    const { addReviewModalOpen, loadMoreReviewModalOpen, loadingData } = this.state;
    const { restaurant, handleNewData } = this.props;

    return(
      <Container className='container-accordion'>
        <Grid>
          <Grid.Row columns={2} only='computer tablet'>
            <GridColumn width={7} >
              {/*  Left Column - Data  */}
              {loadingData ?
                <LeftColumnPlaceholder/> :
                <div>
                  <div key={0} className='mb-1'><Icon name='phone'/><a href={'tel:' + getRestPhoneNum()}>{getRestPhoneNum()}</a></div>
                  <div key={1} className='mb-2'><Icon name='linkify' /><a href={restaurant.details && restaurant.details.link}>Visit Website</a></div>
                  <div key={2}><h4 className='mb-2'>Opening Times</h4> {getRestOpenTime()}</div>
                </div>
              }
            </GridColumn>
            <GridColumn width={9}>
              {/*Right Column - Photo */}
              <Segment>
                <RightColumnPlaceholder />
              </Segment>
            </GridColumn>
          </Grid.Row>

          {/*<Grid.Row columns={2} only='mobile'>*/}
          {/*  <GridColumn>*/}
          {/*    <div className='my-2'>*/}
          {/*      <Icon name='phone'/><a className='mr-2' href={'tel:' + getRestPhoneNum()}>{getRestPhoneNum()}</a>*/}
          {/*      <Icon name='linkify'/><a href={restaurant.details && restaurant.details.link}>Visit Website</a>*/}
          {/*    </div>*/}
          {/*  </GridColumn>*/}
          {/*  <GridColumn textAlign='center'>*/}
          {/*    <div className='my-2'>*/}
          {/*      <p>Open today: 7am - 9pm {this.getOpeningHours()}</p>*/}
          {/*    </div>*/}
          {/*  </GridColumn>*/}
          {/*  <GridColumn width={16}>*/}
          {/*    <Image src={getGoogleMapStaticUrl()} fluid />*/}
          {/*  </GridColumn>*/}
          {/*</Grid.Row>*/}

          <Grid.Row>
            <GridColumn>
              {loadingData ?
                <div>
                  <ReviewsPlaceholder amount={restaurant.isFromFile ? restaurant.details.reviews.length : 5}/>
                </div>
                :
                <div>
                  <h4>Most helpful reviews</h4>
                  {getRestReviews()}
                </div>
              }
            </GridColumn>
          </Grid.Row>

          <Grid.Row>
            <GridColumn className='restaurant-item-buttons'>
              <Modal
                open={loadMoreReviewModalOpen}
                onClose={handleChange}
                name='loadMoreReviewModalOpen'
                value={false}
                basic
                size='small'
                trigger={
                  <Button onClick={handleChange}
                          compact animated='vertical'
                          color='blue'
                          name='loadMoreReviewModalOpen'
                          className='load-more-reviews'
                          value={true}
                  >
                    <Button.Content hidden>
                      <Icon name='arrow down'/>
                    </Button.Content>
                    <Button.Content visible>Load more reviews</Button.Content>
                  </Button>}
              >
                <Header icon='browser' content='Like this feature?' />
                <Modal.Content>
                  <h3>This feature is available only for subscribed users.</h3>
                </Modal.Content>
                <Modal.Actions>
                  <Button color='green'
                          onClick={handleChange}
                          name='loadMoreReviewModalOpen'
                          value={false}
                          inverted>
                    <Icon name='checkmark' /> Got it
                  </Button>
                </Modal.Actions>
              </Modal>

              <Modal
                open={addReviewModalOpen}
                onClose={handleChange}
                name='addReviewModalOpen'
                value={false}
                trigger={
                  <Button onClick={handleChange}
                          name='addReviewModalOpen'
                          value={true}
                          animated
                          compact
                          color='green'>
                    <Button.Content hidden>Write it now!</Button.Content>
                    <Button.Content visible>
                      <Icon name='write'/>Add a Review
                    </Button.Content>
                  </Button>}
              >
                <Modal.Header>Share your experience with us</Modal.Header>
                <Modal.Content image>
                  <Image wrapped size='medium' src={getRestPhotoUrl()} />
                  <Modal.Description>
                    <Header>Tell us what did you like about {restaurant.restaurantName}?</Header>
                    <AddReview
                      restaurant={restaurant}
                      handleClose={handleChange}
                      handleNewData={handleNewData}
                    />
                  </Modal.Description>
                </Modal.Content>
              </Modal>

            </GridColumn>
          </Grid.Row>

        </Grid>
      </Container>
    )
  }
}

