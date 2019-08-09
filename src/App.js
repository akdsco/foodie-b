// Import Data
import restaurantsJSON from './data/restaurants'

// Import CSS
import './css/App.css';

// Import Components
import React from 'react';
import DataDisplay from './components/DataDisplay';
import Container from "semantic-ui-react/dist/commonjs/elements/Container";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid";
import GridColumn from "semantic-ui-react/dist/commonjs/collections/Grid/GridColumn";
import Map from "./components/Map";

// TODO look through the app and see where you can untagle application and create components that pass on information
// as much as it's possible

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: restaurantsJSON,
      ratingMin: 1,
      ratingMax: 5
    }
  }

  addAvgRating() {
    let withAvgRating = [];
    Object.keys(this.state.restaurants).map((rid) => this.state.restaurants[rid]).forEach(restaurant => {
      // calculate average rating for each restaurant
      restaurant.avgRating = restaurant.ratings.map( rating => rating.stars).reduce( (a , b ) => a + b ) / restaurant.ratings.length;
      withAvgRating.push(restaurant)
    });
    this.setState({
      restaurants: withAvgRating
    })
  }

  componentDidMount() {
    this.addAvgRating();
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

  render() {

    const style={height: '100vh'};
    return (
        <div>
          <Container>
            <Grid>
              <Grid.Row centered columns={2} only='computer' style={style}>
                <GridColumn width={8} >
                  <DataDisplay
                      restaurantsList={this.state.restaurants}
                      ratingMax={this.state.ratingMax}
                      ratingMin={this.state.ratingMin}
                      handleMinRate={this.handleMinRate}
                      handleMaxRate={this.handleMaxRate}
                      handleReset={this.handleReset}
                  />
                </GridColumn>
                <GridColumn width={8}>
                  {/*TODO redo this as well*/}
                  <Map restaurantsList={this.state.restaurants.filter(restaurant =>
                      restaurant.avgRating >= this.state.ratingMin &&
                      restaurant.avgRating <= this.state.ratingMax)} />
                </GridColumn>
              </Grid.Row>
              <Grid.Row centered columns={1} only='tablet'>
                <GridColumn>
                  {/*<Map />*/}
                </GridColumn>
              </Grid.Row>
              <Grid.Row centered columns={1} only='mobile'>
                <GridColumn>
                  {/*<MapAlt />*/}
                </GridColumn>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
    );
  }
}