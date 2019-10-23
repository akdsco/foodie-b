import React from 'react'
import Accordion from "semantic-ui-react/dist/commonjs/modules/Accordion";
import RestaurantTitle from "./RestaurantTitle";
import RestaurantContent from "./RestaurantContent";

export default class RestaurantList extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();  // Create a ref object
  }

  scrollToMyRef = () => window.scrollTo(0, this.myRef.current.offsetTop);

  handleAccordionClick = (e, titleProps) =>  {
    const { index } = titleProps;
    this.props.handleActiveRest(index);
    this.scrollToMyRef();
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
        <Accordion styled key={restaurant.id}>
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
              ref={this.myRef}
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