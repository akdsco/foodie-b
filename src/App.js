
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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: restaurantsJSON,
      restaurantsAPI: '',
      ratingMin: 1,
      ratingMax: 5,
      center: {
        lat: 51.5,
        lng: -0.08
      }
    };
    this.handleCenterChange = this.handleCenterChange.bind(this);
    this.fetchPlacesRestaurants = this.fetchPlacesRestaurants.bind(this);
  }

  //TODO update fetchPlaces so that it waits for locateUser before executing

  fetchPlacesRestaurants() {
    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+ this.state.center.lat + ',' + this.state.center.lng + '&radius=2000&type=restaurant&key=AIzaSyCj5lxn67K9uOeUpku2rliDNKa68UQ3xfE';
    // let myH = {
    //   'Access-Control-Allow-Origin': '*',
    //   'X-Content-Type-Options': 'nosniff',
    //   'Content-Type': 'application/json',
    // };

    // fetch(url).then(function(response) {
    //   response.text().then(function(text) {
    //     console.log(text);
    //     rest = text
    //
    //   })
    //     .catch(function(error) {
    //       console.log('Looks like there was a problem: \n', error);
    //     });
    // });

    const self = this;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      response.json().then( data => {
        self.setState({
          restaurantsAPI: data
        })
      })
    })
  };

  componentWillMount() {
    this.addAvgRating();
    this.locateUser();
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

  locateUser() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          position => {
      console.log('User Successfully located');
      this.setState(prevState => ({
      center: {
        ...prevState.center,
        lat: position.coords.latitude,
        lng: position.coords.longitude
      },
      isUserMarkerShown: true
      }))
    },
      (error) => {
        console.log(error);
        console.log('Error: The Geolocation service failed.');
        this.setState(prevState => ({
          center: {
            ...prevState.center,
            lat: 51.516126,
            lng: -0.081679
          },
          isUserMarkerShown: true
          }))
        }
      )
    }
    this.fetchPlacesRestaurants();
  }

  // toggle I'll use for Marker click later on

  // onToggleOpen: (prevState) => {
  //   console.log('onToggleOpen fired');
  //   this.setState({
  //     isOpen: !prevState.isOpen
  //   })
  // }

  handleCenterChange(center) {
    this.setState({
      center: center
    })
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
    console.log(this.state.restaurantsAPI.results);

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
                  <Map
                    restaurantsList={this.state.restaurants.filter(restaurant =>
                      restaurant.avgRating >= this.state.ratingMin &&
                      restaurant.avgRating <= this.state.ratingMax)}
                    // restaurantsAPI={this.state.restaurantsAPI.results.filter(restaurant =>
                    //     restaurant.rating >= this.state.ratingMin &&
                    //     restaurant.rating <= this.state.ratingMax)}
                    center={this.state.center}
                    handleCenterChange={this.handleCenterChange}
                  />
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