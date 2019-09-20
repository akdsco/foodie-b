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

/* TODO think how to let user add custom thumbnail picture to new restaurant (manual creation)
 *
 * TODO implement below:
 *
 * Steps:
 * 1  - Locate user
 * 2  - Get current map bounds
 * 3  - Load restaurants from file if they are inside map bounds
 * 4  - Load restaurants from Google Places
 * 4.5- switch loading to false
 * 5  - Display fetched data
 * 6  - Allow user to disable automatic new search onDragEnd()
 * 7  - If user let's automatic search on and drags map:
 * 8  - switch loading to true
 * 9  - clean up current restaurant state
 * 10 - Get current map bounds
 * 11 - Load restaurants from file if they are inside map bounds
 * 12 - Load restaurants from Google Places
 * 13 - switch loading to false
 *
 */

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: [],
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

  /* =====================
   *   Lifecycle Methods
  _* =====================
*/

  componentDidMount() {
    this.loadFileRestaurants(restaurantsFromFile);
    this.locateUser();
  }

  /* ==================
   *   Custom Methods
  _* ==================
*/

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
          isUserMarkerShown: true,
          }), () => this.loadGooglePlacesRestaurants());
        console.log('from locate user', this.state.restaurants);
        }
      )
    }
  }

  // TODO find how to trigger data fetch every time center updates

  loadGooglePlacesRestaurants = () => {
    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + this.state.center.lat + ',' + this.state.center.lng + '&radius=600&type=restaurant&key=' + process.env.REACT_APP_G_API;
    const self = this;
    let newRestaurants = self.state.restaurants.slice();

    fetch(url, {
      method: 'GET',
    }).then(response => {
      response.json().then(data => {
        console.log('Google Places Restaurants (raw api data)', data);
        let count = self.state.restaurants.length - 1;
        data.results.forEach( r => {
            count++;
            let restaurantObject = {
              "id": count,
              "streetViewURL": 'https://maps.googleapis.com/maps/api/streetview?size=300x200&location='+ r.geometry.location.lat +','+ r.geometry.location.lng +'&heading=151.78&pitch=-0.76&key='+ process.env.REACT_APP_G_API,
              "streetViewImgBig": 'https://maps.googleapis.com/maps/api/streetview?size=500x300&location='+ r.geometry.location.lat +','+ r.geometry.location.lng +'&heading=151.78&pitch=-0.76&key='+ process.env.REACT_APP_G_API,
              "place_id": r.place_id,
              "numberOfReviews": r.user_ratings_total,
              "avgRating": r.rating,
              "restaurantName": r.name,
              "address": r.vicinity,
              "lat": r.geometry.location.lat,
              "long": r.geometry.location.lng,
              "open": r.opening_hours.open_now,
            };
            // TODO check 'Cannot read property 'open_now' of undefined' after onDragEnd event
            newRestaurants.push(restaurantObject);
          }
        );
        self.setState({
          restaurants: newRestaurants,
          loading: false,
        })
      });
    });
  };

  /* ===================
   *   Handler Methods
  _* ===================
*/

  handleCenterChange = (center) => {
    this.setState({
      center: center
    }, () => this.loadGooglePlacesRestaurants())
  };

  handleMinRate = (e, { rating }) => {
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
    const { activeRest } = this.state;
    const newIndex = activeRest === index ? -1 : index;
    this.setState({
      activeRest: newIndex
    })
  };

  render() {
    const style={height: '100vh'};
    const { restaurants, ratingMin, ratingMax, center, userLocation, isUserMarkerShown, loading, activeRest } = this.state;
    const { handleMaxRate, handleMinRate, handleReset, handleActiveRest, handleCenterChange } = this;
    return (
      <div>
        <Container>
          <Grid>
            <Grid.Row centered columns={2} only='computer' style={style}>
              <GridColumn width={9} >
                <Dimmer.Dimmable dimmed={loading}>
                  <Dimmer active={loading} inverted>
                    <Loader>Loading</Loader>
                  </Dimmer>

                  <DataDisplay
                    restaurants={restaurants}
                    ratingMax={ratingMax}
                    ratingMin={ratingMin}
                    activeRest={activeRest}

                    handleActiveRest={handleActiveRest}
                    handleMinRate={handleMinRate}
                    handleMaxRate={handleMaxRate}
                    handleReset={handleReset}
                  />
                </Dimmer.Dimmable>
              </GridColumn>
              <GridColumn width={7}>
                <Dimmer.Dimmable dimmed={loading}>
                  <Dimmer active={loading} inverted>
                    <Loader>Loading</Loader>
                  </Dimmer>

                  <Map
                    restaurants={restaurants.filter(restaurant =>
                      restaurant.avgRating >= ratingMin &&
                      restaurant.avgRating <= ratingMax)
                    }
                    center={center}
                    userMarker={isUserMarkerShown}
                    userLocation={userLocation}
                    activeRest={activeRest}

                    handleActiveRest={handleActiveRest}
                    handleCenterChange={handleCenterChange}
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

              </GridColumn>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}