// Import Data
import restaurantsJSON from './data/restaurants'

// Import CSS
import './css/App.css';

// Import Components
import React from 'react';
import Map from "./components/Map";
import DataDisplay from './components/DataDisplay';
import Container from "semantic-ui-react/dist/commonjs/elements/Container";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid";
import GridColumn from "semantic-ui-react/dist/commonjs/collections/Grid/GridColumn";
import ReviewItem from "./components/ReviewItem";
import Accordion from "semantic-ui-react/dist/commonjs/modules/Accordion";
import RestaurantItem from "./components/RestaurantItem";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: restaurantsJSON,
      activeIndex: -1,
      ratingMin: 1,
      ratingMax: 5
    }
  }

  handleMinRate = (e, { rating }) => {
    console.log('min ' + rating);
    if((this.state.ratingMax > 0) && (rating < this.state.ratingMax)) {
      this.setState({
        ratingMin: rating
      })
    } else {
      this.setState({
        ratingMin: rating,
        ratingMax: rating
      })
    }
  };

  handleMaxRate = (e, { rating }) => {
    console.log('max ' + rating);
    if(this.state.ratingMin <= rating) {
      console.log('fired');
      this.setState({
        ratingMax: rating
      })
    }
  };

  handleReset = () => {
    this.setState({
      ratingMin: 1,
      ratingMax: 5
    })
  };

  handleAccordionClick = (e, titleProps) =>  {
    console.log('is this even working?');
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({
      activeIndex: newIndex
    })
  };

  sortRestaurants() {
    // converts object into array
    return Object.keys(this.state.restaurants).map((rid) => this.state.restaurants[rid])
    // you can specify sorting here if you'd like in the future
  }

  render() {

    const { activeIndex } = this.state;

    let filteredRestaurants = [];
    this.sortRestaurants().forEach( restaurant => {
      // calculate average rating for each restaurant
      restaurant.avgRating = restaurant.ratings.map( rating => rating.stars).reduce( (a , b ) => a + b ) / restaurant.ratings.length;
      // filter out restaurants based on selected rating range
      if(restaurant.avgRating <= this.state.ratingMax && restaurant.avgRating >= this.state.ratingMin) {
        // push qualified restaurants to array
        filteredRestaurants.push(restaurant)
      }
    });

    // fill array with react restaurant components
    let restaurantsList = [];
    filteredRestaurants.forEach( restaurant => {
      const reviews = restaurant.ratings.map( review => <ReviewItem key={review.id} item={review} />);

      restaurantsList.push(
          <div key={restaurant.id}>
            <Accordion.Title active={activeIndex === restaurant.id} index={restaurant.id} onClick={this.handleAccordionClick}>
              <RestaurantItem item={restaurant} avgRating={restaurant.avgRating}/>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === restaurant.id}>
              {reviews}
            </Accordion.Content>
          </div>
      )
    });


    const style={height: '100vh'};
    return (
        <div>
          <Container>
            <Grid>
              <Grid.Row centered columns={2} only='computer' style={style}>
                <GridColumn width={8} >
                  <DataDisplay
                      restaurantsList={restaurantsList}
                      ratingMin={this.state.ratingMin}
                      ratingMax={this.state.ratingMax}
                      handleMinRate={this.handleMinRate}
                      handleMaxRate={this.handleMaxRate}
                      handleReset={this.handleReset}
                  />
                </GridColumn>
                <GridColumn width={8}>
                  <Map restaurantsList={filteredRestaurants}/>
                </GridColumn>
              </Grid.Row>
              <Grid.Row centered columns={1} only='tablet'>
                <GridColumn>
                  {/*<Map />*/}
                </GridColumn>
              </Grid.Row>
              <Grid.Row centered columns={1} only='mobile'>
                <GridColumn>
                  {/*<Map />*/}
                </GridColumn>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
    );
  }
}

export default App;