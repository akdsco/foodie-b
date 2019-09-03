// Import Data
import restaurantsFromFile from './data/restaurants'

// Import CSS
import './css/App.css';

// Import Components
import React from 'react';
import DataDisplay from './components/DataDisplay';
import Container from "semantic-ui-react/dist/commonjs/elements/Container";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid";
import GridColumn from "semantic-ui-react/dist/commonjs/collections/Grid/GridColumn";
import Map from "./components/Map";

//TODO merge restaurants and restaurantsAPI into one array
//TODO create separate methods to process file and API - concat result into merged restaurants (in state)

//TODO investigate, react only loading all restaurant items after moving map (why not straight after updating state?)

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: [],
      normalizedRest: [],
      ratingMin: 1,
      ratingMax: 5,
      isUserMarkerShown: false,
      userLocation: {
        lat: 1,
        lng: 1
      },
      center: {
        lat: 1,
        lng: 1
      }
    };
  }

  loadGooglePlacesRestaurants = () => {
    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + this.state.center.lat + ',' + this.state.center.lng + '&radius=2000&type=restaurant&key=' + process.env.REACT_APP_G_API;
    let restaurants = [];
    const self = this;
    let newRestaurants = self.state.restaurants.slice();

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => {
      response.json().then(data => {
        console.log('Google Places Restaurants (raw api data)', data);
        let count = self.state.restaurants.length - 1;
        data.results.forEach( r => {
          count++;
          let restaurantObject = {
            "id": count,
            "place_id": r.place_id,
            "avgRating": r.rating,
            "restaurantName": r.name,
            "address": r.vicinity,
            "flag": "gb",
            "desc": "generic description",
            "lat": r.geometry.location.lat,
            "long": r.geometry.location.lng,
            "ratings":[
              {
                "id": 11,
                "name": "generic name",
                "stars":1,
                "comment":"generic comment"
              },
              {
                "id": 12,
                "name": "generic name",
                "stars":4,
                "comment":"generic comment"
              }
            ]
          };
          restaurants.push(restaurantObject);
          newRestaurants.push(restaurantObject);
        }
        );
      });
      self.setState(() => ({
        restaurants: newRestaurants,
        normalizedRest: restaurants
        }));
    })
  };

  componentDidMount() {
    this.loadFileRestaurants(restaurantsFromFile);
    this.locateUser();
  }

  loadFileRestaurants = (restaurants) => {
    const withAvgRating = [];
    // calculate average rating for each restaurant
    Object.keys(restaurants).map((id) => restaurants[id]).forEach(restaurant => {
      restaurant.avgRating = restaurant.ratings.map( rating => rating.stars).reduce( (a , b ) => a + b ) / restaurant.ratings.length;
      withAvgRating.push(restaurant)
    });
    this.setState({
      restaurants: this.state.restaurants.concat(withAvgRating)
    });
  };

  locateUser() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          position => {
      console.log('User Successfully located');
      this.setState(prevState => ({
      userLocation: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      },
      center: {
        ...prevState.center,
        lat: position.coords.latitude,
        lng: position.coords.longitude
      },
      isUserMarkerShown: true
      }));
      // this.fetchPlacesRestaurants();
    },
      (error) => {
        console.log(error);
        console.log('Error: The Geolocation service failed.');
        this.setState(prevState => ({
          userLocation: {
            lat: 51.516126,
            lng: -0.081679
          },
          center: {
            ...prevState.center,
            lat: 51.516126,
            lng: -0.081679
          },
          isUserMarkerShown: true
          }));
        // fetching Google Places Restaurants after locating user
        this.loadGooglePlacesRestaurants();
      }
      )
    }
  }

  handleCenterChange = (center) => {
    this.setState({
      center: center
    })
  };

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
                      restaurants={this.state.restaurants}
                      normalizedRest={this.state.normalizedRest}
                      ratingMax={this.state.ratingMax}
                      ratingMin={this.state.ratingMin}
                      handleMinRate={this.handleMinRate}
                      handleMaxRate={this.handleMaxRate}
                      handleReset={this.handleReset}
                  />
                </GridColumn>
                <GridColumn width={8}>
                  <Map
                    normalizedRest={this.state.normalizedRest === undefined ? {} :
                      this.state.normalizedRest.filter(restaurant =>
                      restaurant.avgRating >= this.state.ratingMin &&
                      restaurant.avgRating <= this.state.ratingMax)}
                    restaurants={this.state.restaurants.filter(restaurant =>
                      restaurant.avgRating >= this.state.ratingMin &&
                      restaurant.avgRating <= this.state.ratingMax)}
                    center={this.state.center}
                    userMarker={this.state.isUserMarkerShown}
                    userLocation={this.state.userLocation}
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