// Imports
import React from 'react';
// Data
import restaurantsFromFile from './data/restaurants'
// CSS
import './css/style.css';
// Components
import Map from "./components/Map";
import DataDisplay from './components/DataDisplay';
// Dependencies
import {Dimmer, Loader, Container, Grid, GridColumn} from "semantic-ui-react";
import runtimeEnv from '@mars/heroku-js-runtime-env'
import {DataDisplayWH} from "./components/DataDisplayWH";

// const env = runtimeEnv();
// const REACT_APP_G_API = env.REACT_APP_G_API;

// TODO change 'long' to 'lng' in .json data file and consecutive use in components

export default class App extends React.Component {
  state = {
    restaurants: [],
    ratingMin: 0,
    ratingMax: 5,
    flags: {
      isLoadingRestaurants: true,
      isRestSearchAllowed: true,
      isUserMarkerShown: false,
    },
    searchRadius: 750,
    userLocation: {
      lat: 1,
      lng: 1
    },
    center: {
      lat: 1,
      lng: 1
    },
    activeRest: -1,
    windowWidth: window.innerWidth,
  };

  /* =====================
   *   Lifecycle Methods
  _* =====================
*/

  componentDidMount() {
    this.loadFileRestaurants(restaurantsFromFile);
    this.locateUser();

    window.addEventListener('resize', this.handleWidthChange);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWidthChange);
  }

  /* ===================
   *   Handler Methods
  _* ===================
*/

  handleWidthChange = () => {
    this.setState({windowWidth: window.innerWidth})
  };

  handleCenterChange = (center) => {
    if (this.state.flags.isRestSearchAllowed) {
      this.setState(prevState => ({
        center: center,
        flags: {
          ...prevState.flags,
          isLoadingRestaurants: true,
        }
      }), () => this.loadGooglePlacesRestaurants());
    } else {
      this.setState({center: center});
    }
  };

  handleRestSearch = () => {
    this.setState(prevState => ({
      flags: {
        ...prevState.flags,
        isRestSearchAllowed: !prevState.flags.isRestSearchAllowed,
      }
    }))
  };

  handleMinRate = (e, {rating}) => {
    const {ratingMax} = this.state;

    if ((ratingMax > 0) && (rating < ratingMax)) {
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

  handleMaxRate = (e, {rating}) => {
    if (this.state.ratingMin <= rating) {
      this.setState({
        ratingMax: rating
      })
    }
  };

  handleReset = () => {
    this.setState({
      ratingMin: 0,
      ratingMax: 5
    })
  };

  handleActiveRest = (index) => {
    const {activeRest} = this.state;
    const newIndex = activeRest === index ? -1 : index;
    if (newIndex !== -1) {
      this.loadGooglePlaceDetails(newIndex);
    }
    this.setState({
      activeRest: newIndex
    })
  };

  handleNewData = (dataObject, type) => {
    let restaurants = [...this.state.restaurants];
    let shiftedRest = [];

    if (type === 'restaurant') {
      // First in the array will be restaurants from file and then added restaurants by user
      shiftedRest = restaurants.filter(r => r.isFromFile);
      shiftedRest.push(dataObject);
      shiftedRest[shiftedRest.length - 1].id = shiftedRest.length - 1;
      // Then we need to shift id's for Google Place supplied restaurants by 1 and push objects to shiftedRest array
      const increment = a => a + 1;
      restaurants.filter(r => (!r.isFromFile)).map(r => ({
        ...r,
        id: increment(r.id)
      })).forEach(r => shiftedRest.push(r));
      // Save efforts
      restaurants = shiftedRest;
    } else if (type === 'review') {
      let index = this.state.activeRest;

      // Recalculating avgRating for particular restaurant
      restaurants[index].details.reviews.push(dataObject);
      restaurants[index].avgRating = restaurants[index].details.reviews.map(r => r.stars).reduce((a, b) => a + b) / (restaurants[index].details.reviews.length);
      restaurants[index].numberOfReviews = restaurants[index].details.reviews.length;
    }

    this.setState({
      restaurants: restaurants,
    })
  };

  handleZoomChange = (zoom) => {
    let searchRadius = 0;
    const searchRadiusValues = {
      12: 4000,
      13: 2500,
      14: 1200,
      15: 750,
      16: 200
    };

    if (zoom < 12) {
      searchRadius = 5000;
    } else if (zoom >= 12 && zoom <= 16) {
      searchRadius = searchRadiusValues[zoom];
    } else {
      searchRadius = 150;
    }
    this.setState({searchRadius: searchRadius})
  };

  /* ==================
   *   Custom Methods
  _* ==================
*/

  loadFileRestaurants = (restaurants) => {
    const withAvgRating = [];
    // calculate average rating for each restaurant
    Object.keys(restaurants).map((id) => restaurants[id]).forEach(restaurant => {
      restaurant.avgRating = restaurant.details.reviews.map(rating => rating.stars).reduce((a, b) => a + b) / restaurant.details.reviews.length;
      restaurant.isFromFile = true;
      restaurant.numberOfReviews = restaurant.details.reviews.length;
      withAvgRating.push(restaurant)
    });
    this.setState( {
      restaurants: withAvgRating
    });
  };

  locateUser() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          position => {
      // debug log
      // console.log('User Successfully located');
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
       flags: {
        ...prevState.flags,
        isUserMarkerShown: true
      }
       }), () => this.loadGooglePlacesRestaurants());
    }, error => {
        console.log('Error locating user: ', error);
        // debug log
        // console.log('Error: The Geolocation service failed.');
        this.setState(prevState => ({
          userLocation: {
            lat: 51.556126,
            lng: -0.081679
          },
          center: {
            ...prevState.center,
            lat: 51.556126,
            lng: -0.081679
          },
           flags: {
             ...prevState.flags,
             isUserMarkerShown: true,
          }
          }), () => this.loadGooglePlacesRestaurants());
        }
      )
    }
  }

  loadGooglePlacesRestaurants = () => {
    const {center, searchRadius} = this.state;
    const self = this;
    //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=49.0609792,1.115059199999997&radius=5050&type=restaurant&key=
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + center.lat + ',' + center.lng + '&radius=' + searchRadius + '&type=restaurant&key=' + process.env.REACT_APP_G_API;
    const restaurants = self.state.restaurants.slice().filter(restaurant => restaurant.isFromFile);

    // debug log
    // console.log('Restaurants before loading Google Places: ', restaurants);

    fetch(url, {
      method: 'GET',
    }).then(response => {
      response.json().then(data => {
        let count = restaurants.length - 1;

        data.results.forEach( r => {
            count++;
            let restaurantObject = {
              "id": count,
              "streetViewURL": 'https://maps.googleapis.com/maps/api/streetview?size=500x300&location='+ r.geometry.location.lat +','+ r.geometry.location.lng +'&heading=151.78&pitch=-0.76&key='+ process.env.REACT_APP_G_API,
              "place_id": r.place_id,
              "isFromFile": false,
              "numberOfReviews": r.user_ratings_total > 5 ? 5 : r.user_ratings_total,
              "avgRating": r.rating,
              "restaurantName": r.name,
              "address": r.vicinity,
              "lat": r.geometry.location.lat,
              "long": r.geometry.location.lng,
              "open": r.opening_hours ? r.opening_hours.open_now : true,
              "loadedDetails": false,
            };
            restaurants.push(restaurantObject);
          },
        );

        self.setState(prevState => ({
          restaurants: restaurants,
          flags: {
            ...prevState.flags,
            isLoadingRestaurants: false,
          }
        }))
      });
    }, error => {
      console.log('Failed to load Google Places Restaurants', error)
    });
  };

  loadGooglePlaceDetails = (index) => {
    const self = this;
    const currentRestaurantsState = [...self.state.restaurants];
    const placeID = this.state.restaurants[index].place_id;

    // if details already fetched previously --> don't fetch again
    if(!currentRestaurantsState[index].details) {
      // debug log
      // console.log('First time query, fetching placeID: ' + placeID);

      if(placeID) {
        let url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + placeID + '&key=' + process.env.REACT_APP_G_API;

        fetch(url, {
          method: 'GET',
        }).then(response => {
          response.json().then(data => {
            if(data.status === 'OK') {
              // debug log
              // console.log('PlaceID details ', data);

              const revs = () => {
                let array = [];

                data.result.reviews.forEach( (r, id) =>
                  array.push({
                    "id": id,
                    "name": r.author_name,
                    "stars": r.rating,
                    "comment": r.text,
                    "image_url": r.profile_photo_url
                  })
                );
                return array;
              };

              const details = {
                'fullAddress': data.result.adr_address,
                'reviews' : revs(),
                'services' : data.result.types,
                'photos': data.result.photos,
                'link': data.result.website,
                'openingHours': data.result.opening_hours ? data.result.opening_hours : {"weekday_text" : ["Open 24 / 7"]},
                'phoneNumber': data.result.international_phone_number,
              };

              const updatedRestaurants = [...self.state.restaurants];
              updatedRestaurants[index].details = details;
              updatedRestaurants[index].loadedDetails = true;
              self.setState({
                restaurants :updatedRestaurants
              });
            } else {
              console.log('API call unsuccessful');
            }
          })
        }, error => {
          console.log('Failed to load Google Place Details: ', error);
        })
      } else {
        console.log('Sorry no placeID supplied.');
      }
    } else {
      console.log('Consecutive placeID query or restaurant from file, load denied');
    }
  };

  render() {
    const styleDesktop={overflowY: 'hidden', paddingBottom: '0'};
    const styleMobile={paddingTop: '2rem', paddingBottom: '0'};
    const { restaurants, ratingMin, ratingMax, center, userLocation, activeRest, flags, windowWidth } = this.state;
    const { handleMaxRate, handleMinRate, handleReset, handleActiveRest,
            handleCenterChange, handleNewData, handleZoomChange, handleRestSearch } = this;

    return (
      <div>
        {/* Full Desktop Mode */}
        <Container>
          <Grid>
            <Grid.Row centered columns={2} only='computer' style={styleDesktop}>
              <GridColumn width={9}>
                  <DataDisplayWH
                    restaurants={restaurants}
                    ratingMax={ratingMax}
                    ratingMin={ratingMin}
                    activeRest={activeRest}
                    windowWidth={windowWidth}
                    flags={flags}

                    handleReset={handleReset}
                    handleMinRate={handleMinRate}
                    handleMaxRate={handleMaxRate}
                    handleNewData={handleNewData}
                    handleActiveRest={handleActiveRest}
                  />
              </GridColumn>
              <GridColumn width={7}>
                <Dimmer.Dimmable dimmed={flags.isLoadingRestaurants}>
                  <Dimmer active={flags.isLoadingRestaurants} inverted>
                    <Loader>Loading Restaurants</Loader>
                  </Dimmer>
                  <Map
                    restaurants={restaurants.filter(restaurant =>
                      restaurant.avgRating >= ratingMin &&
                      restaurant.avgRating <= ratingMax)}
                    center={center}
                    flags={flags}
                    userLocation={userLocation}
                    activeRest={activeRest}

                    handleRestSearch={handleRestSearch}
                    handleNewData={handleNewData}
                    handleZoomChange={handleZoomChange}
                    handleActiveRest={handleActiveRest}
                    handleCenterChange={handleCenterChange}
                  />
                </Dimmer.Dimmable>
              </GridColumn>
            </Grid.Row>
          </Grid>
        </Container>

        {/* Tablet Mode */}

        {windowWidth <= 991 &&
        <Grid>
          <Grid.Row centered columns={2} only='tablet' style={styleMobile}>
            <GridColumn width={9}>
                <DataDisplayWH
                  restaurants={restaurants}
                  ratingMax={ratingMax}
                  ratingMin={ratingMin}
                  activeRest={activeRest}
                  flags={flags}
                  windowWidth={windowWidth}

                  handleReset={handleReset}
                  handleMinRate={handleMinRate}
                  handleMaxRate={handleMaxRate}
                  handleNewData={handleNewData}
                  handleActiveRest={handleActiveRest}
                />
            </GridColumn>
            <GridColumn width={7}>
              <Dimmer.Dimmable dimmed={flags.isLoadingRestaurants}>
                <Dimmer active={flags.isLoadingRestaurants} inverted>
                  <Loader>Loading Restaurants</Loader>
                </Dimmer>

                <Map
                  restaurants={restaurants.filter(restaurant =>
                    restaurant.avgRating >= ratingMin &&
                    restaurant.avgRating <= ratingMax)}
                  center={center}
                  flags={flags}
                  userLocation={userLocation}
                  activeRest={activeRest}

                  handleRestSearch={handleRestSearch}
                  handleNewData={handleNewData}
                  handleZoomChange={handleZoomChange}
                  handleActiveRest={handleActiveRest}
                  handleCenterChange={handleCenterChange}
                />
              </Dimmer.Dimmable>
            </GridColumn>
          </Grid.Row>
        </Grid>
        }

        {/*  Mobile Mode */}

        {windowWidth < 768 &&
        <Grid>
          <Grid.Row centered columns={1} only='mobile' style={styleMobile}>
            <GridColumn>
              <Dimmer.Dimmable dimmed={flags.isLoadingRestaurants}>
                <Dimmer active={flags.isLoadingRestaurants} inverted>
                  <Loader>Loading Restaurants</Loader>
                </Dimmer>

                <DataDisplayWH
                  restaurants={restaurants}
                  ratingMax={ratingMax}
                  ratingMin={ratingMin}
                  activeRest={activeRest}
                  windowWidth={windowWidth}

                  handleReset={handleReset}
                  handleMinRate={handleMinRate}
                  handleMaxRate={handleMaxRate}
                  handleNewData={handleNewData}
                  handleActiveRest={handleActiveRest}

                  center={center}
                  flags={flags}
                  userLocation={userLocation}

                  handleRestSearch={handleRestSearch}
                  handleZoomChange={handleZoomChange}
                  handleCenterChange={handleCenterChange}
                />
              </Dimmer.Dimmable>
            </GridColumn>
          </Grid.Row>
        </Grid>
        }
      </div>
    );
  }
}