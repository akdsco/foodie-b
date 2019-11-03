// Imports
import React from 'react'
// CSS
import '../css/style.css';
// Components
import RestItem from "./RestItem";
// Dependencies
import {Dimmer, Loader} from "semantic-ui-react";

export default class RestList extends React.Component {

  sortRestaurants() {
    // converts object into array (add sorting if you'd like)
    return Object.keys(this.props.restaurants).map((rid) => this.props.restaurants[rid])
  }

  render() {
    // Component Props
    const {activeRest, handleNewData, flags, restaurants, windowWidth, handleActiveRest} = this.props;

    return(
      <div>
        <Dimmer.Dimmable dimmed={typeof flags === 'undefined' ? true : flags.isLoadingRestaurants}>
          <Dimmer active={typeof flags === 'undefined' ? true : flags.isLoadingRestaurants} inverted>
            <Loader>Loading Restaurants</Loader>
          </Dimmer>

          <p> Shortlisted Restaurants: {restaurants.length} </p>
          {
          this.sortRestaurants().map(restaurant =>
            <RestItem
              key={restaurant.id}
              restaurant={restaurant}
              activeRest={activeRest}
              windowWidth={windowWidth}
              handleNewData={handleNewData}
              handleActiveRest={handleActiveRest}
            />)
          }
        </Dimmer.Dimmable>
      </div>
    )
  }

}