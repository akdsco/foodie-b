import React from 'react'
import {Container, Button, Rating} from "semantic-ui-react";

export default class Filter extends React.Component {
  // constructor(props) {
  //   super(props);
    // this.state = {
    //   minRating: 0,
    //   maxRating: 0
    // };
    // this.handleMinRate = this.handleMinRate.bind(this);
    // this.handleMaxRate = this.handleMaxRate.bind(this);
  // }

  // handleMinRate = (e, { rating }) => {
  //   if((this.state.maxRating > 0) && (rating < this.state.maxRating)) {
  //     this.setState({
  //       minRating: rating
  //     })
  //   } else {
  //     this.setState({
  //       minRating: rating,
  //       maxRating: rating
  //     })
  //   }
  // };
  //
  // handleMaxRate = (e, { rating }) => {
  //   if(this.state.minRating <= rating) {
  //     this.setState({
  //       maxRating: rating
  //     })
  //   }
  // };
  //
  // applyFilter = () => {
  //   this.props.changeActiveItem();
  //   this.props.addFilter();
  // };


  render() {
    console.log(this.props);
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