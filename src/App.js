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


// TODO implement loader for picture inside accordion item (take's 1-2 sec sometimes)
// TODO on zoom change -> update state of radius for API call
// TODO add scroll to currently open restaurant

// Errors
// TODO Each child in a list should have a unique "key" prop. => check Accordion Content => when clicking on 10th G.Places loaded restaurant gaucho, only appears on first load, then it doesn't for any other item

/* TODO implement below:
 *
 * Steps:
 * 1  - Locate user
 * 2  - Get current map bounds / Not doable, api works with radius -> make the view square
 * 3  - Load restaurants from file if they are inside map bounds / Don't write it perfect.
 * 4  - Load restaurants from Google Places
 * 4.5- switch loading to false
 * 5  - Display fetched data
 * 6  - Allow user to disable automatic new search onDragEnd() -> postpone this feature
 * 7  - If user let's automatic search on and drags map:
 * 8  - switch loading to true
 * 9  - clean up current restaurant state
 * 10 - Get current map bounds
 * 11 - Load restaurants from file if they are inside map bounds
 * 12 - Load restaurants from Google Places
 * 13 - switch loading to false
 * 13 - switch loading to false
 *
 */

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: [],
      loadingRestaurants: false,
      ratingMin: 0,
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

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if(this.state.activeRest !== -1) {
  //     const ref = this.state.restaurants[this.state.activeRest].ref;
  //     this.scrollToRef(ref);
  //   }
  // }

  /* ==================
   *   Custom Methods
  _* ==================
*/

  scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);

  loadFileRestaurants = (restaurants) => {
    const withAvgRating = [];
    // calculate average rating for each restaurant
    Object.keys(restaurants).map((id) => restaurants[id]).forEach(restaurant => {
      restaurant.avgRating = restaurant.details.reviews.map( rating => rating.stars).reduce( (a , b ) => a + b ) / restaurant.details.reviews.length;
      restaurant.isFromFile = true;
      restaurant.numberOfReviews = restaurant.details.reviews.length;
      withAvgRating.push(restaurant)
    });
    this.setState({
      restaurants: this.state.restaurants.concat(withAvgRating)
    });
  };

  // locateUser() {
  //   if(navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //         position => {
  //     console.log('User Successfully located');
  //     this.setState(prevState => ({
  //     userLocation: {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude
  //     },
  //     center: {
  //       ...prevState.center,
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude
  //     },
  //     isUserMarkerShown: true
  //      }), () => this.loadGooglePlacesRestaurants());
  //   }, (error) => {
  //       console.log(error);
  //       // console.log('Error: The Geolocation service failed.');
  //       this.setState(prevState => ({
  //         userLocation: {
  //           lat: 51.516126,
  //           lng: -0.081679
  //         },
  //         center: {
  //           ...prevState.center,
  //           lat: 51.516126,
  //           lng: -0.081679
  //         },
  //         isUserMarkerShown: true,
  //         }), () => this.loadGooglePlacesRestaurants());
  //       // console.log('from locate user', this.state.restaurants);
  //       }
  //     )
  //   }
  // }

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
          })/*, () => this.loadGooglePlacesRestaurants()*/);
        }, (error) => {
          console.log(error);
          // console.log('Error: The Geolocation service failed.');
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
          })/*, () => this.loadGooglePlacesRestaurants()*/);
          // console.log('from locate user', this.state.restaurants);
        }
      )
    }
  }

  loadGooglePlacesRestaurants = () => {
    const self = this;
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + this.state.center.lat + ',' + this.state.center.lng + '&radius=750&type=restaurant&key=' + process.env.REACT_APP_G_API;
    const restaurants = self.state.restaurants.slice().filter(restaurant => restaurant.isFromFile);
    console.log(restaurants.length);

    console.log('Restaurants before loading Google Places: ', restaurants);

    fetch(url, {
      method: 'GET',
    }).then(response => {
      response.json().then(data => {
        console.log('Google Places Restaurants (raw api data)', data);
        let count = restaurants.length - 1;

        data.results.forEach( r => {
            count++;
            let restaurantObject = {
              "id": count,
              // "streetViewURL": 'https://maps.googleapis.com/maps/api/streetview?size=500x300&location='+ r.geometry.location.lat +','+ r.geometry.location.lng +'&heading=151.78&pitch=-0.76&key='+ process.env.REACT_APP_G_API,
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
        // console.log('Restaurants after loading Google Places: ', restaurants);

        self.setState({
          restaurants: restaurants,
          loadingRestaurants: false,
        })
      });
    });
  };

  loadGooglePlaceDetails = (index) => {
    const self = this;
    const currentRestaurantsState = [...self.state.restaurants];
    const placeID = this.state.restaurants[index].place_id;

    // if details already fetched previously --> don't fetch again, otherwise yes
    if(!currentRestaurantsState[index].details) {
      console.log('First time query, fetching placeID data now');

      if(placeID) {
        // console.log(placeID);
        let url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + placeID + '&key=' + process.env.REACT_APP_G_API;

        fetch(url, {
          method: 'GET',
        }).then(response => {
          response.json().then(data => {
            if(data.status === 'OK') {
              console.log('PlaceID details ', data);

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
              updatedRestaurants[index].loadedDetails = true;
              updatedRestaurants[index].details = details;
              self.setState({
                restaurants :updatedRestaurants
              });
            } else {
              console.log('API call unsuccessful');
            }
          })
        })
      } else {
        console.log('Sorry no placeID supplied.');
      }
    } else {
      console.log('Consecutive placeID query or restaurant from file, load denied');
    }
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
      ratingMin: 0,
      ratingMax: 5
    })
  };

  handleActiveRest = (index) => {
    const { activeRest } = this.state;
    const newIndex = activeRest === index ? -1 : index;
    if(newIndex !== -1) {
      this.loadGooglePlaceDetails(newIndex);
    }
    this.setState({
      activeRest: newIndex
    })
  };

  handleNewData = (dataObject, type) => {
    let restaurants = [...this.state.restaurants];
    let shiftedRest = [];

    if(type === 'restaurant') {
      // First in the array will be restaurants from file and then added restaurants by user
      shiftedRest = restaurants.filter(r=>r.isFromFile);
      shiftedRest.push(dataObject);
      shiftedRest[shiftedRest.length - 1].id = shiftedRest.length - 1;
      // Then we need to shift id's for Google Place supplied restaurants by 1 and push objects to shiftedRest array
      const increment = a => a + 1;
      restaurants.filter(r=> (!r.isFromFile)).map(r => ({...r, id: increment(r.id)})).forEach(r => shiftedRest.push(r));
      // Save efforts
      restaurants = shiftedRest;
    } else if (type === 'review') {
      let index = this.state.activeRest;

      // Recalculating avgRating for particular restaurant
      restaurants[index].details.reviews.push(dataObject);
      restaurants[index].avgRating = restaurants[index].details.reviews.map(r => r.stars).reduce((a, b) => a + b) / (restaurants[index].details.reviews.length);
      restaurants[index].numberOfReviews = restaurants[index].details.reviews.length;
      console.log(restaurants[index].avgRating);
    }

    this.setState({
      restaurants: restaurants,
    })
  };

  render() {
    const style={height: '100vh'};
    const { restaurants, ratingMin, ratingMax, center, userLocation,
            isUserMarkerShown, loadingRestaurants, activeRest } = this.state;
    const { handleMaxRate, handleMinRate, handleReset, handleActiveRest,
            handleCenterChange, handleNewData } = this;
    return (
      <div>
        <Container>
          <Grid>
            <Grid.Row centered columns={2} only='computer' style={style}>
              <GridColumn width={9} >
                <Dimmer.Dimmable dimmed={loadingRestaurants}>
                  <Dimmer active={loadingRestaurants} inverted>
                    <Loader>LoadingRestaurants</Loader>
                  </Dimmer>

                  <DataDisplay
                    restaurants={restaurants}
                    ratingMax={ratingMax}
                    ratingMin={ratingMin}
                    activeRest={activeRest}

                    handleReset={handleReset}
                    handleMinRate={handleMinRate}
                    handleMaxRate={handleMaxRate}
                    handleNewData={handleNewData}
                    handleActiveRest={handleActiveRest}
                  />
                </Dimmer.Dimmable>
              </GridColumn>
              <GridColumn width={7}>
                <Dimmer.Dimmable dimmed={loadingRestaurants}>
                  <Dimmer active={loadingRestaurants} inverted>
                    <Loader>LoadingRestaurants</Loader>
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

                    handleNewData={handleNewData}
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