import React from 'react';
import ReviewItem from "./ReviewItem";
import {Container, GridColumn, List, Image} from "semantic-ui-react";

// Import CSS
import '../css/style.css';
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid";

export default class AccordionContent extends React.Component {

  loadReviews = () => {
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
                  <ReviewItem key={counter} item={review} />
                </GridColumn>
              </Grid.Row>
            </Grid>)
        })
        : null;
    }
    return reviews;
  };

  loadOpeningTimes = () => {
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

  cleanUrl = (str) => {
    // erase https = > ^https?\:\/\/
    let strCopy = (' ' + str).slice(1);
    let result = strCopy.replace(/^https?:\/\/+/g, '');
    // clean after first '/' -> [^\/]*
    result = result.replace(/^(.*?)\/+/g, '$&').slice(0, result.length - 1);
    return result;
  };

  generateNumber = () => {
    let number = 'tel:';

    if(this.props.restaurant.details) {
      if(this.props.restaurant.details.phoneNumber) {
        number += this.props.restaurant.details.phoneNumber;
      }
    }

    return number;
  };


  getPhotoUrl = () => {
    let url = '';

    if(this.props.restaurant.details) {
      if(this.props.restaurant.details.photos) {
        let photoRef = this.props.restaurant.details.photos[0].photo_reference;
        // url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=' + photoRef + '&key=' + process.env.REACT_APP_G_API;
      }
    }
    return url;
  };

  render() {

    // const {restaurant} = this.props.restaurant.details ?;

    return(
      <Container className='container-accordion'>
        <Grid>
          <Grid.Row divided columns={2} only='computer'>
            <GridColumn width={7}>
              {/*  Left Column - Data  */}
              <List>
                {/*<List.Item key='0'>*/}
                {/*  <List.Icon name='marker' />*/}
                {/*  <List.Content>{this.props.restaurant.details && this.props.restaurant.details.fullAddress}</List.Content>*/}
                {/*</List.Item>*/}
                <List.Item key='1'>
                  <List.Icon name='phone' />
                  <List.Content><a href={this.generateNumber()}>Call us</a></List.Content>

                </List.Item>
                <List.Item key='2'>
                  <List.Icon name='linkify' />
                  <List.Content>
                    <a href={this.props.restaurant.details && this.props.restaurant.details.link}>
                      Visit Website
                    </a>
                  </List.Content>
                </List.Item>
                {/*<List.Item key='3'>*/}
                {/*  <div class='mb-2'>*/}
                {/*    <Label color='blue' tag>*/}
                {/*      Restaurant*/}
                {/*    </Label>*/}
                {/*  </div>*/}
                {/*  <Label className='mb-2' color='blue' tag>*/}
                {/*    Hotel*/}
                {/*  </Label>*/}
                {/*  <Label className='mb-2' color='blue' tag>*/}
                {/*    Police Station*/}
                {/*  </Label>*/}
                {/*</List.Item>*/}
              </List>
              <div>
                <h4 class='mb-2'>Opening Times</h4>
                {this.loadOpeningTimes()}
              </div>
            </GridColumn>
            <GridColumn width={9}>
            {/*  Right Column - Photo */}
              <Image /*src='https://react.semantic-ui.com/images/wireframe/image.png'*/
                     src={this.getPhotoUrl() ? this.getPhotoUrl : 'https://react.semantic-ui.com/images/wireframe/image.png'}
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
              {this.loadReviews()}
              <a href='#'>Load more reviews?</a>
            </GridColumn>
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
}

