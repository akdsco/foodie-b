import React from 'react';
import ReviewItem from "./ReviewItem";
import {Container, GridColumn, List, Image, Button, Icon} from "semantic-ui-react";

// Import CSS
import '../css/style.css';
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid";

export default class AccordionContent extends React.Component {

  //TODO add a functionality that will query more than 5 reviews if user demands more

  getRestReviews = () => {
    let reviews = [];
    let counter = -1;

    if (this.props.restaurant.details) {
      reviews = this.props.restaurant.details.reviews ?
        this.props.restaurant.details.reviews.map(review => {
          counter++;
          return(
            <Grid>
              <Grid.Row centered only='computer'>
                <GridColumn width={15}>
                  <ReviewItem key={counter} item={review} fromFile={this.props.restaurant.isFromFile} />
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

    if(this.props.restaurant.details) {
      if(this.props.restaurant.details.openingHours) {
        this.props.restaurant.details.openingHours.weekday_text.forEach(day => {
          openingTimes.push(<p class='mb-2'>{day}</p>)
        });
      }
    }
    return openingTimes;
  };

  getRestPhoneNum = () => {
    let number = 'tel:';

    if(this.props.restaurant.details) {
      if(this.props.restaurant.details.phoneNumber) {
        number += this.props.restaurant.details.phoneNumber;
      }
    }

    return number;
  };


  getRestPhotoUrl = () => {
    let url = 'https://react.semantic-ui.com/images/wireframe/image.png';

    if(this.props.restaurant.details) {
      let data = this.props.restaurant.details;

      if(data.photos) {
        // noinspection JSUnusedLocalSymbols
        let photoRef = data.photos[0].photo_reference;
        // url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=' + photoRef + '&key=' + process.env.REACT_APP_G_API;
      } else if (typeof data.photoUrl !== 'undefined' && data.photoUrl !== '') {
        url = data.photoUrl;
      }
    }

    return url
  };

  render() {

    return(
      <Container className='container-accordion'>
        <Grid>
          <Grid.Row divided columns={2} only='computer'>
            <GridColumn width={7}>
              {/*  Left Column - Data  */}
              <List>
                <List.Item key='0'>
                  <List.Icon name='phone' />
                  <List.Content><a href={this.getRestPhoneNum()}>Call us</a></List.Content>
                </List.Item>
                <List.Item key='1'>
                  <List.Icon name='linkify' />
                  <List.Content>
                    <a href={this.props.restaurant.details && this.props.restaurant.details.link}>
                      Visit Website
                    </a>
                  </List.Content>
                </List.Item>
              </List>
              <div>
                <h4 className='mb-2'>Opening Times</h4>
                {this.getRestOpenTime()}
              </div>
            </GridColumn>

            <GridColumn width={9}>
              {/*Right Column - Photo */}
                <Image
                  src={this.getRestPhotoUrl()}
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
              <h4>Reviews</h4>
              {this.getRestReviews()}
            </GridColumn>
          </Grid.Row>

          <Grid.Row>
            <GridColumn className='restaurant-item-buttons'>
              <Button compact animated='vertical' color='blue'>
                <Button.Content hidden>
                  <Icon name='arrow down'/>
                </Button.Content>
                <Button.Content visible>Load more reviews</Button.Content>
              </Button>
              {/*<a href='#'>Load more reviews?</a>*/}
              <Button animated compact color='green'>
                <Button.Content hidden>Write it now!</Button.Content>
                <Button.Content visible>
                  <Icon name='write'/>Add a Review
                </Button.Content>
              </Button>
            </GridColumn>
          </Grid.Row>

        </Grid>
      </Container>
    )
  }
}

