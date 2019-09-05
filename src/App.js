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
import {Dimmer, Loader} from "semantic-ui-react";

//TODO merge restaurants and restaurantsAPI into one array
//TODO create separate methods to process file and API - concat result into merged restaurants (in state)

//TODO investigate, react only loading all restaurant items after moving map (why not straight after updating state?)

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: [],
      normalizedRest: [],
      loading: true,
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
      },
      activeRest: -1,
      updatingItem: false
    };

  }

  componentDidMount() {
    this.loadFileRestaurants(restaurantsFromFile);
    this.locateUser();
  }

  loadGooglePlacesRestaurants = () => {
    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + this.state.center.lat + ',' + this.state.center.lng + '&radius=700&type=restaurant&key=' + process.env.REACT_APP_G_API;
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
      self.setState({
        restaurants: newRestaurants,
        loading: false,
        // normalizedRest: restaurants,
      }, () => {
        debugger;
        console.log(this.state.restaurants);
        return '1'
      });
      // TODO find how to triger data fetch every time center updates
      // fill in missing details by checking each fetched place using place_id
      // this.getDetailsAboutRestaurants(newRestaurants);
    });
  };

  // Tried this as well -> , () => self.updatingItem() as a callback and didn't help

  updatingItem(){
    console.log('inside updating Item');
    this.setState(() => ({
      updatingItem: true
    }))
  }

  getDetailsAboutRestaurants(array) {
    // let array.map()
    return array;
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
      }), () => this.loadGooglePlacesRestaurants());
      // this.fetchPlacesRestaurants();
    }, (error) => {
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
          }), () => this.loadGooglePlacesRestaurants());
        console.log('from locate user', this.state.restaurants);
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

  handleActiveRest = (index) => {
    // console.log('in app', index);
    const { activeRest } = this.state;
    console.log('index',index,'activeRest', activeRest);
    const newIndex = activeRest === index ? -1 : index;
    this.setState({
      activeRest: newIndex
    })
  };

  render() {
    const style={height: '100vh'};
    const { restaurants, ratingMin, ratingMax, center, userLocation, isUserMarkerShown, loading } = this.state;
    return (
        <div>
          <Container>
            <Grid>
              <Grid.Row centered columns={2} only='computer' style={style}>
                <GridColumn width={8} >
                  <DataDisplay
                      restaurants={restaurants}
                      normalizedRest={this.state.normalizedRest}
                      ratingMax={ratingMax}
                      ratingMin={ratingMin}
                      activeRest={this.state.activeRest}
                      handleActiveRest={this.handleActiveRest}
                      handleMinRate={this.handleMinRate}
                      handleMaxRate={this.handleMaxRate}
                      handleReset={this.handleReset}
                  />
                </GridColumn>
                <GridColumn width={8}>
                  <Dimmer.Dimmable dimmed={loading}>
                    <Dimmer active={loading} inverted>
                      <Loader>Loading</Loader>
                    </Dimmer>

                    <Map
                      normalizedRest={this.state.normalizedRest === undefined ? {} :
                        this.state.normalizedRest.filter(restaurant =>
                          restaurant.avgRating >= ratingMin &&
                          restaurant.avgRating <= ratingMax)
                      }
                      restaurants={restaurants.filter(restaurant =>
                        restaurant.avgRating >= ratingMin &&
                        restaurant.avgRating <= ratingMax)
                      }
                      center={center}
                      userMarker={isUserMarkerShown}
                      userLocation={userLocation}
                      activeRest={this.state.activeRest}
                      handleActiveRest={this.handleActiveRest}
                      handleCenterChange={this.handleCenterChange}
                    />
                  </Dimmer.Dimmable>
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