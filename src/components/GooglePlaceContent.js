import React from 'react';
import ReviewItem from "./ReviewItem";
import {Container, GridColumn, List, Image, Label} from "semantic-ui-react";

// Import CSS
import '../css/style.css';
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid";

export default class GooglePlaceContent extends React.Component {

  loadReviews = () => {
    let reviews = [];
    let counter = -1;

    if (this.props.restaurant.details) {
      reviews = this.props.restaurant.details.reviews ?
        this.props.restaurant.details.reviews.map(review => {
          counter++;
          return(<ReviewItem key={counter} item={review} />)
        })
        : null;
    }
    return reviews;
  };

  render() {

    return(
      <Container className='container-accordion'>
        <Grid>
          <Grid.Row divided padded columns={2} only='computer'>
            <GridColumn width={7}>
              {/*  Left Column - Data  */}
              <List>
                <List.Item>
                  <List.Icon name='marker' />
                  <List.Content>Address</List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name='phone' />
                  <List.Content>telephone num</List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name='linkify' />
                  <List.Content>
                    <a href='http://www.semantic-ui.com'>url-link</a>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <Label tag>
                    Restaurant
                  </Label>
                  <Label as='a' color='red' tag>
                    Hotel
                  </Label>
                  <Label as='a' color='teal' tag>
                    Police Station
                  </Label>
                </List.Item>
              </List>
            </GridColumn>
            <GridColumn width={9}>
            {/*  Right Column - Photo */}
              <Image src='https://react.semantic-ui.com/images/wireframe/image.png' fluid />
            </GridColumn>
          </Grid.Row>
          <Grid.Row centered>
            <GridColumn className='opening-hours-column'>
              <h4>Opening Hours</h4>
              <p>"Monday: 7:00 am – 11:00 pm"</p>
              <p>"Tuesday: 7:00 am – 11:00 pm"</p>
              <p>"Wednesday: 7:00 am – 11:00 pm"</p>
              <p>"Thursday: 7:00 am – 11:00 pm"</p>
              <p>"Friday: 7:00 am – 11:00 pm"</p>
              <p>"Saturday: 8:00 am – 11:00 pm"</p>
              <p>"Sunday: 8:00 am – 11:00 pm"</p>
            </GridColumn>
          </Grid.Row>
          <Grid.Row>
            <GridColumn>
              <h4>Reviews</h4>
              {this.loadReviews()}
            </GridColumn>
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
}

