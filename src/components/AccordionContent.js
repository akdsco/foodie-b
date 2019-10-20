import React from 'react';
import ReviewItem from "./ReviewItem";
import {Container, GridColumn, List, Image, Button, Icon, Modal, Header} from "semantic-ui-react";

//TODO add a functionality that will query more than 5 reviews if user demands more
// not doable due to google limits, only available for paying users

//TODO change current structure so that after you add reviews, they won't get deleted when you change menu card
// basically move all data storage to App.js... :( lot's to do

// Import CSS
import '../css/style.css';
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid";
import AddReview from "./AddReview";

export default class AccordionContent extends React.Component {
  state = {
    addReviewModalOpen: false,
    loadMoreReviewModalOpen: false,
  };

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
              <Grid.Row centered only='computer'>
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
      if(restaurant.details.openingHours) {
        restaurant.details.openingHours.weekday_text.forEach(day => {
          openingTimes.push(<p class='mb-2'>{day}</p>)
        });
      }
    }
    return openingTimes;
  };

  getRestPhoneNum = () => {
    let number = 'tel:';
    const { restaurant } = this.props;

    if(restaurant.details) {
      if(restaurant.details.phoneNumber) {
        number += restaurant.details.phoneNumber;
      }
    }

    return number;
  };


  getRestPhotoUrl = () => {
    let url = 'https://react.semantic-ui.com/images/wireframe/image.png';
    const { restaurant } = this.props;

    if(restaurant.details) {
      let data = restaurant.details;

      if(data.photos) {
        // noinspection JSUnusedLocalSymbols
        let photoRef = data.photos[1].photo_reference;
        // url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=' + photoRef + '&key=' + process.env.REACT_APP_G_API;
      } else if (typeof data.photoUrl !== 'undefined' && data.photoUrl !== '') {
        url = data.photoUrl;
      }
    }

    return url
  };

  render() {
    const { handleChange, getRestPhoneNum, getRestOpenTime, getRestPhotoUrl, getRestReviews } = this;
    const { addReviewModalOpen, loadMoreReviewModalOpen } = this.state;
    const { restaurant, handleNewData } = this.props;

    return(
      <Container className='container-accordion'>
        <Grid>
          <Grid.Row divided columns={2} only='computer'>
            <GridColumn width={7}>
              {/*  Left Column - Data  */}
              <List>
                <List.Item key='0'>
                  <List.Icon name='phone' />
                  <List.Content><a href={getRestPhoneNum()}>Call us</a></List.Content>
                </List.Item>
                <List.Item key='1'>
                  <List.Icon name='linkify' />
                  <List.Content>
                    <a href={restaurant.details && restaurant.details.link}>
                      Visit Website
                    </a>
                  </List.Content>
                </List.Item>
              </List>
              <div>
                <h4 className='mb-2'>Opening Times</h4>
                {getRestOpenTime()}
              </div>
            </GridColumn>

            <GridColumn width={9}>
              {/*Right Column - Photo */}
                <Image
                  src={getRestPhotoUrl()}
                  fluid
                  label={{
                    as: 'a',
                    color: 'green',
                    content: 'Book Table',
                    icon: 'food',
                    ribbon: true,
                  }}
                />
            </GridColumn>

          </Grid.Row>

          <Grid.Row>
            <GridColumn>
              <h4>Most helpful reviews</h4>
              {getRestReviews()}
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

