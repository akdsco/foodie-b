import React from 'react'
import {Container, Button, Rating} from "semantic-ui-react";

export default class Filter extends React.Component {

  render() {
    return(
        <Container>
          <p>Choose your range:</p>
          <h5>Minimum rating</h5>
          <Rating
            rating={this.props.ratingMin}
            size="huge"
            maxRating={5}
            onRate={this.props.handleMinRate}
          />
          <h5>Maximum rating</h5>
          <Rating
            rating={this.props.ratingMax}
            size="huge"
            maxRating={5}
            onRate={this.props.handleMaxRate}
          />
          <div style={{marginTop: '1.3rem'}}>
            <Button
              name='Info'
              positive
              onClick={this.props.handleItemClick}
            >Filter</Button>
            <Button negative>Reset</Button>
          </div>
        </Container>
    )
  }
}