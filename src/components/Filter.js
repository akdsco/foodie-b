import React from 'react'
import {Container, Button, Rating} from "semantic-ui-react";

export default class Filter extends React.Component {
  // handleReset(e) {
  //   if(e.target.value === 'reset') {
  //     this.props.handleItemClick;
  //     this.props.handleReset();
  //   }
  // }

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
              positive
              name='Info'
              onClick={this.props.handleItemClick}
            >Filter</Button>
            <Button
              negative
              name='Info'
              value='reset'
              onClick={this.props.handleItemClick}
            >Reset</Button>
          </div>
        </Container>
    )
  }
}