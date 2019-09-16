import React from 'react'
import Accordion from "semantic-ui-react/dist/commonjs/modules/Accordion";
import RestaurantItem from "./RestaurantItem";
import ReviewItem from "./ReviewItem";
import Flag from "semantic-ui-react/dist/commonjs/elements/Flag";
import {Item} from "semantic-ui-react";

export default class RestaurantList extends React.Component {

  handleAccordionClick = (e, titleProps) =>  {
    const { index } = titleProps;
    this.props.handleActiveRest(index);
  };

  sortRestaurants() {
    // converts object into array only
    return Object.keys(this.props.restaurants).map((rid) => this.props.restaurants[rid])
    // you can specify sorting here if you'd like in the future
  }


  render() {

    // Component Props
    const {activeRest} = this.props;

    let restaurantsList = [];

    this.sortRestaurants().forEach(restaurant => {
      let reviews;
      if(restaurant.ratings) {
        reviews = restaurant.ratings.map( review => <ReviewItem key={review.id} item={review} />);
      } else {
        reviews = null
      }

      restaurantsList.push(
        <Accordion styled key={restaurant.id}>
          <Accordion.Title active={activeRest === restaurant.id} index={restaurant.id} onClick={this.handleAccordionClick}>
            <RestaurantItem item={restaurant} avgRating={restaurant.avgRating}/>
          </Accordion.Title>
          <Accordion.Content active={activeRest === restaurant.id}>
            <Flag name={restaurant.flag} />
            <Item.Description>{restaurant.desc}</Item.Description>
            {reviews}
          </Accordion.Content>
        </Accordion>
      )

    });
    return(
      <div>
        {restaurantsList}
      </div>
    )
  }

}