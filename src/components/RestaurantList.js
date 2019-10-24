// Import CSS
import '../css/style.css';

// Import Components
import React from 'react'
import Accordion from "semantic-ui-react/dist/commonjs/modules/Accordion";
import RestaurantTitle from "./RestaurantTitle";
import RestaurantContent from "./RestaurantContent";

// TODO create a name property for each title, and send this to map component, when marker clicked js will scroll to
//  this name component.. ????

export default class RestaurantList extends React.Component {
  constructor(props) {
    super(props);
  }


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
    const {activeRest, handleNewData} = this.props;
    let restaurantsList = [];

    this.sortRestaurants().forEach(restaurant => {
      restaurantsList.push(
        <Accordion className='mb-2' styled key={restaurant.id}>
          <Accordion.Title
            active={activeRest === restaurant.id}
            index={restaurant.id}
            onClick={this.handleAccordionClick}>
              <RestaurantTitle
                item={restaurant}
                avgRating={restaurant.avgRating}
              />
          </Accordion.Title>
          <Accordion.Content  active={activeRest === restaurant.id}>
            <RestaurantContent
              restaurant={restaurant}

              handleNewData={handleNewData}
            />
          </Accordion.Content>
        </Accordion>)
    });

    return(
      <div>
        <p> Shortlisted Restaurants: {this.props.restaurants.length} </p>
        {restaurantsList}
      </div>
    )
  }

}