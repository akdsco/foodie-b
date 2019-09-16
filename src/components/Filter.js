import React from 'react'
import {Container, Button, Rating} from "semantic-ui-react";

export default class Filter extends React.Component {

  render() {
    // Component Props
    const {ratingMin, ratingMax, handleMinRate, handleMaxRate, handleItemClick} = this.props;

    return(
        <Container>
          <p>Choose your range:</p>
          <h5>Minimum rating</h5>
          <Rating
            rating={ratingMin}
            size="huge"
            maxRating={5}
            onRate={handleMinRate}
          />
          <h5>Maximum rating</h5>
          <Rating
            rating={ratingMax}
            size="huge"
            maxRating={5}
            onRate={handleMaxRate}
          />
          <div style={{marginTop: '1.3rem'}}>
            <Button
              positive
              name='Restaurants'
              onClick={handleItemClick}
            >Filter</Button>
            <Button
              negative
              name='Restaurants'
              value='reset'
              onClick={handleItemClick}
            >Reset</Button>
          </div>
        </Container>
    )
  }
}