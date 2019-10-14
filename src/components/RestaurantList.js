import React from 'react'
import Accordion from "semantic-ui-react/dist/commonjs/modules/Accordion";
import RestaurantItem from "./RestaurantItem";
import ReviewItem from "./ReviewItem";

export default class RestaurantList extends React.Component {

  // TODO make this component stateful and think how to implement placedID call and how to obtain details about each restaurant Item
  // initialize state with a given restaurant prop and then maintain state for each Restaurant..

  handleAccordionClick = (e, titleProps) =>  {
    const { index } = titleProps;
    console.log('RestaurantList Accordion Click: ', index);
    this.props.handleActiveRest(index);
  };

  sortRestaurants() {
    // converts object into array
    return Object.keys(this.props.restaurants).map((rid) => this.props.restaurants[rid])
    // you can specify sorting here if you'd like in the future
  }


  render() {

    // Component Props
    const {activeRest} = this.props;

    let restaurantsList = [];

    this.sortRestaurants().forEach(restaurant => {
      let reviews;
      let counter = 0;
      let googleReviews;
      console.log(restaurant.details);
      restaurant.ratings ? reviews = restaurant.ratings.map(review => <ReviewItem key={review.id} item={review} />) : reviews = null;

      // TODO create react component from array to be displaye in Accordion Content
      restaurant.details === [] ? googleReviews = restaurant.details.reviews.map(review => <ReviewItem key={counter} item={review} />) : googleReviews = null;
      if(googleReviews) {
        console.log(googleReviews);
      }

      restaurantsList.push(
        <Accordion styled key={restaurant.id}>
          <Accordion.Title active={activeRest === restaurant.id} index={restaurant.id} onClick={this.handleAccordionClick}>
            <RestaurantItem item={restaurant} avgRating={restaurant.avgRating}/>
          </Accordion.Title>
          <Accordion.Content active={activeRest === restaurant.id}>
            {reviews}
            {restaurant.loadedDetails ?
              <div>
                {googleReviews}
              </div>
            : ''}
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