import React from 'react'
import Accordion from "semantic-ui-react/dist/commonjs/modules/Accordion";
import RestaurantItem from "./RestaurantItem";
import AccordionContent from "./AccordionContent";

export default class RestaurantList extends React.Component {

  // ----- DONE ------
  // TODO make this component stateful and think how to implement placedID call and how to obtain details about each restaurant Item

  handleAccordionClick = (e, titleProps) =>  {
    const { index } = titleProps;
    this.props.handleActiveRest(index);
  };

  sortRestaurants() {
    // converts object into array (add sorting if you'd like)
    return Object.keys(this.props.restaurants).map((rid) => this.props.restaurants[rid])
  }

  render() {
    // Component Props
    const {activeRest} = this.props;
    let restaurantsList = [];

    this.sortRestaurants().forEach(restaurant => {
      restaurantsList.push(
        <Accordion styled key={restaurant.id}>
          <Accordion.Title active={activeRest === restaurant.id} index={restaurant.id} onClick={this.handleAccordionClick}>
            <RestaurantItem item={restaurant} avgRating={restaurant.avgRating}/>
          </Accordion.Title>
          <Accordion.Content active={activeRest === restaurant.id}>
            <AccordionContent restaurant={restaurant} />
          </Accordion.Content>
        </Accordion>)
    });

    return(
      <div>
        {restaurantsList}
      </div>
    )
  }

}