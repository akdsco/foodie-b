// Import CSS
import '../css/style.css';

// Import Components
import React from 'react'
import Accordion from "semantic-ui-react/dist/commonjs/modules/Accordion";
import RestaurantTitle from "./RestaurantTitle";
import RestaurantContent from "./RestaurantContent";

export default class RestaurantList extends React.Component {
  constructor(props) {
    super(props);
    this.references = [];
  }

  /* =====================
   *   Lifecycle Methods
  _* =====================
*/

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.props.activeRest !== -1) this.handleScroll(this.props.activeRest)
  };

  /* ===================
   *   Handler Methods
  _* ===================
*/

  handleScroll = id => {
    this.references[id].scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  handleAccordionClick = (e, titleProps) =>  {
    const { index } = titleProps;
    this.props.handleActiveRest(index);
  };

  /* ==================
   *   Custom Methods
  _* ==================
*/

  setRestRef = e => {
    this.references.push(e);
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
        <div key={restaurant.id} ref={this.setRestRef}>
          <Accordion className='mb-2' styled >
            <Accordion.Title
              active={activeRest === restaurant.id}
              index={restaurant.id}
              onClick={this.handleAccordionClick}>
                <RestaurantTitle
                  active={activeRest === restaurant.id}
                  item={restaurant}
                  avgRating={restaurant.avgRating}
                />
            </Accordion.Title>
            <Accordion.Content  active={activeRest === restaurant.id}>
              <RestaurantContent
                restaurant={restaurant}
                activeRest={activeRest}
                handleNewData={handleNewData}
              />
            </Accordion.Content>
          </Accordion>
        </div>)
    });

    return(
      <div>
        <p> Shortlisted Restaurants: {this.props.restaurants.length} </p>
        {restaurantsList}
      </div>
    )
  }

}