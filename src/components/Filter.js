import React from 'react'
import {Container, Button, Rating} from "semantic-ui-react";

export default class Filter extends React.Component {
  // handleReset(e) {
  //   if(e.target.value === 'reset') {
  //     this.props.handleItemClick;
  //     this.props.handleReset();
  //   }
  // }
  handleRestAPI = () => {
    console.log(this.props.restaurantsAPI);
  };
  handleProps = () => {
    console.log(this.props);
  };

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
            <Button
              onClick={this.handleRestAPI}
            >RestAPI</Button>
            <Button
              onClick={this.handleProps}
            >Props</Button>
          </div>
        </Container>
    )
  }
}