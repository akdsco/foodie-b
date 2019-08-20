import React from 'react'
import Accordion from "semantic-ui-react/dist/commonjs/modules/Accordion";
import RestaurantItem from "./RestaurantItem";
import ReviewItem from "./ReviewItem";

export default class RestaurantList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: -1,
    }
  }

  handleAccordionClick = (e, titleProps) =>  {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({
      activeIndex: newIndex
    })
  };

  sortRestaurants() {
    // converts object into array only
    return Object.keys(this.props.restaurants).map((rid) => this.props.restaurants[rid])
    // you can specify sorting here if you'd like in the future
  }

  render() {
    const { activeIndex } = this.state;
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
          <Accordion.Title active={activeIndex === restaurant.id} index={restaurant.id} onClick={this.handleAccordionClick}>
            <RestaurantItem item={restaurant} avgRating={restaurant.avgRating}/>
          </Accordion.Title>
          <Accordion.Content active={activeIndex === restaurant.id}>
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