// Imports
import React, { Component } from "react";
// Data
import restaurantsFromFile from "./data/restaurants";
// CSS
import "./css/style.css";
// Components
import Map from "./components/Map";
import DataDisplay from "./components/DataDisplay";
// Dependencies
import { Dimmer, Loader, Container, Grid, GridColumn } from "semantic-ui-react";

// TODO fix open_now as the API has changed?

// TODO add prop-types library and use it throughout the application to make it more robust
//  https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes

const FIREBASE_LOAD_RESTAURANTS =
  "https://us-central1-akds-portfolio.cloudfunctions.net/loadRestaurants";
const FIREBASE_LOAD_RESTAURANT_DETAILS =
  "https://us-central1-akds-portfolio.cloudfunctions.net/loadRestaurantDetails";

export default class App extends Component {
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
      lng: 1,
    },
    center: {
      lat: 1,
      lng: 1,
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

    window.addEventListener("resize", this.handleWidthChange);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWidthChange);
  }

  /* ===================
   *   Handler Methods
  _* ===================
*/

  handleWidthChange = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  handleCenterChange = (center) => {
    if (this.state.flags.isRestSearchAllowed) {
      this.setState(
        (prevState) => ({
          center: center,
          flags: {
            ...prevState.flags,
            isLoadingRestaurants: true,
          },
        }),
        () => this.loadGooglePlacesRestaurants()
      );
    } else {
      this.setState({ center: center });
    }
  };

  handleRestSearch = () => {
    this.setState((prevState) => ({
      flags: {
        ...prevState.flags,
        isRestSearchAllowed: !prevState.flags.isRestSearchAllowed,
      },
    }));
  };

  handleMinRate = (e, { rating }) => {
    const { ratingMax } = this.state;

    if (ratingMax > 0 && rating < ratingMax) {
      this.setState({
        ratingMin: rating,
      });
    } else {
      this.setState({
        ratingMin: rating,
        ratingMax: rating,
      });
    }
  };

  handleMaxRate = (e, { rating }) => {
    if (this.state.ratingMin <= rating) {
      this.setState({
        ratingMax: rating,
      });
    }
  };

  handleReset = () => {
    this.setState({
      ratingMin: 0,
      ratingMax: 5,
    });
  };

  handleActiveRest = (index) => {
    const { activeRest } = this.state;
    const newIndex = activeRest === index ? -1 : index;
    if (newIndex !== -1) {
      this.loadGooglePlaceDetails(newIndex);
    }
    this.setState({
      activeRest: newIndex,
    });
  };

  handleNewData = (dataObject, type) => {
    let restaurants = [...this.state.restaurants];
    let shiftedRest = [];

    if (type === "restaurant") {
      // First in the array will be restaurants from file and then added restaurants by user
      shiftedRest = restaurants.filter((r) => r.isFromFile);
      shiftedRest.push(dataObject);
      shiftedRest[shiftedRest.length - 1].id = shiftedRest.length - 1;
      // Then we need to shift id's for Google Place supplied restaurants by 1 and push objects to shiftedRest array
      const increment = (a) => a + 1;
      restaurants
        .filter((r) => !r.isFromFile)
        .map((r) => ({
          ...r,
          id: increment(r.id),
        }))
        .forEach((r) => shiftedRest.push(r));
      // Save efforts
      restaurants = shiftedRest;
    } else if (type === "review") {
      let index = this.state.activeRest;

      // Recalculating avgRating for particular restaurant
      restaurants[index].details.reviews.push(dataObject);
      restaurants[index].avgRating =
        restaurants[index].details.reviews
          .map((r) => r.stars)
          .reduce((a, b) => a + b) / restaurants[index].details.reviews.length;
      restaurants[index].numberOfReviews =
        restaurants[index].details.reviews.length;
    }

    this.setState({
      restaurants: restaurants,
    });
  };

  handleZoomChange = (zoom) => {
    let searchRadius;
    const searchRadiusValues = {
      12: 4000,
      13: 2500,
      14: 1200,
      15: 750,
      16: 200,
    };

    if (zoom < 12) {
      searchRadius = 5000;
    } else if (zoom >= 12 && zoom <= 16) {
      searchRadius = searchRadiusValues[zoom];
    } else {
      searchRadius = 150;
    }
    this.setState({ searchRadius: searchRadius });
  };

  /* ==================
   *   Custom Methods
  _* ==================
*/

  loadFileRestaurants = (restaurants) => {
    const withAvgRating = [];
    // calculate average rating for each restaurant
    Object.keys(restaurants)
      .map((id) => restaurants[id])
      .forEach((restaurant) => {
        restaurant.avgRating =
          restaurant.details.reviews
            .map((rating) => rating.stars)
            .reduce((a, b) => a + b) / restaurant.details.reviews.length;
        restaurant.isFromFile = true;
        restaurant.numberOfReviews = restaurant.details.reviews.length;
        withAvgRating.push(restaurant);
      });
    this.setState({
      restaurants: withAvgRating,
    });
  };

  locateUser() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // debug log
          // console.log('User Successfully located');
          this.setState(
            (prevState) => ({
              userLocation: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              center: {
                ...prevState.center,
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              flags: {
                ...prevState.flags,
                isUserMarkerShown: true,
              },
            }),
            () => this.loadGooglePlacesRestaurants()
          );
        },
        (error) => {
          console.log("Error locating user: ", error);
          // debug log
          // console.log('Error: The Geolocation service failed.');
          this.setState(
            (prevState) => ({
              userLocation: {
                lat: 51.516126,
                lng: -0.081679,
              },
              center: {
                ...prevState.center,
                lat: 51.516126,
                lng: -0.081679,
              },
              flags: {
                ...prevState.flags,
                isUserMarkerShown: true,
              },
            }),
            () => this.loadGooglePlacesRestaurants()
          );
        }
      );
    }
  }

  loadGooglePlacesRestaurants = () => {
    const { center, searchRadius, restaurants } = this.state;
    const restaurantsFromFile = restaurants
      .slice()
      .filter((restaurant) => restaurant.isFromFile);

    // debug
    // console.log('Restaurants before loading Google Places: ', restaurants);
    fetch(FIREBASE_LOAD_RESTAURANTS, {
      method: "POST",
      body: JSON.stringify({
        center: center,
        searchRadius: searchRadius,
        count: restaurantsFromFile.length,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const { restaurants } = JSON.parse(data.body);
        this.setState((prevState) => ({
          restaurants: [...restaurantsFromFile, ...restaurants],
          flags: {
            ...prevState.flags,
            isLoadingRestaurants: false,
          },
        }));
      })
      .catch((err) =>
        console.log(
          "Error in loadGooglePlacesRestaurants fetch function: ",
          err
        )
      );
  };

  loadGooglePlaceDetails = (index) => {
    const currentRestaurantsState = [...this.state.restaurants];
    const placeID = this.state.restaurants[index].place_id;

    // if details already fetched previously --> don't fetch again
    if (!currentRestaurantsState[index].details) {
      // if restaurant comes from google, not from file
      if (placeID) {
        fetch(FIREBASE_LOAD_RESTAURANT_DETAILS, {
          method: "POST",
          body: JSON.stringify({
            placeID: placeID,
          }),
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            const updatedRestaurants = [...this.state.restaurants];
            const { details } = JSON.parse(data.body);
            updatedRestaurants[index].details = details;
            updatedRestaurants[index].loadedDetails = true;
            this.setState({
              restaurants: updatedRestaurants,
            });
          });
        //  call cloud function sending placeID in body
        //  cloud function returns data, setState with it
      } else {
        console.log("Sorry no placeID supplied.");
      }
    } else {
      console.log(
        "Consecutive placeID query or restaurant from file, load denied"
      );
    }
  };

  render() {
    const styleDesktop = { overflowY: "hidden", paddingBottom: "0" };
    const styleMobile = { paddingTop: "2rem", paddingBottom: "0" };
    const {
      restaurants,
      ratingMin,
      ratingMax,
      center,
      userLocation,
      activeRest,
      flags,
      windowWidth,
    } = this.state;
    const { isLoadingRestaurants } = flags;
    const {
      handleMaxRate,
      handleMinRate,
      handleReset,
      handleActiveRest,
      handleCenterChange,
      handleNewData,
      handleZoomChange,
      handleRestSearch,
    } = this;

    return (
      <div>
        {/* Full Desktop Mode */}
        <Container>
          <Grid>
            <Grid.Row centered columns={2} only="computer" style={styleDesktop}>
              <GridColumn width={9}>
                <DataDisplay
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
                <Dimmer.Dimmable dimmed={isLoadingRestaurants}>
                  <Dimmer active={isLoadingRestaurants} inverted>
                    <Loader>Loading Restaurants</Loader>
                  </Dimmer>
                  <Map
                    restaurants={restaurants.filter(
                      (rest) =>
                        rest.avgRating >= ratingMin &&
                        rest.avgRating <= ratingMax
                    )}
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

        {windowWidth <= 991 && (
          <Grid>
            <Grid.Row centered columns={2} only="tablet" style={styleMobile}>
              <GridColumn width={9}>
                <DataDisplay
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
                <Dimmer.Dimmable dimmed={isLoadingRestaurants}>
                  <Dimmer active={isLoadingRestaurants} inverted>
                    <Loader>Loading Restaurants</Loader>
                  </Dimmer>

                  <Map
                    restaurants={restaurants.filter(
                      (rest) =>
                        rest.avgRating >= ratingMin &&
                        rest.avgRating <= ratingMax
                    )}
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
        )}

        {/*  Mobile Mode */}

        {windowWidth < 768 && (
          <Grid>
            <Grid.Row centered columns={1} only="mobile" style={styleMobile}>
              <GridColumn>
                <Dimmer.Dimmable dimmed={isLoadingRestaurants}>
                  <Dimmer active={isLoadingRestaurants} inverted>
                    <Loader>Loading Restaurants</Loader>
                  </Dimmer>

                  <DataDisplay
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
        )}
      </div>
    );
  }
}
