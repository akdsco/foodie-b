// Import Components
import React from 'react'
import RestaurantItem from "./RestaurantItem"
import { Menu , Segment } from "semantic-ui-react";
import ItemGroup from "semantic-ui-react/dist/commonjs/views/Item/ItemGroup"
import SearchRestaurants from "./SearchRestaurants"

// Import Data
import restaurantsARR from '../data/restaurants'

// Import CSS
import '../css/DataDisplay.css'

// Import images
import logoImg from '../img/logo.png'
import Sticky from "semantic-ui-react/dist/commonjs/modules/Sticky";
import Accordion from "semantic-ui-react/dist/commonjs/modules/Accordion";
import ReviewItem from "./ReviewItem";

export default class DataDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'Info',
      restaurants: restaurantsARR,
      activeIndex: 0
    };
    this.handleAccordionClick = this.handleAccordionClick.bind(this);
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  handleAccordionClick = (e, titleProps) =>  {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({
      activeIndex: newIndex
    })
  };

  render() {
    const { activeItem, activeIndex } = this.state;

    const restaurants = this.state.restaurants.map( restaurant => {
      // find out average rating for each restaurant
      let avgRating = restaurant.ratings.map(rating => rating.stars).reduce((a,b) => a+b) / restaurant.ratings.length;
      const reviews = restaurant.ratings.map(review => <ReviewItem key={review.id} item={review} />);

      return (
        <div>
          <Accordion.Title active={activeIndex === restaurant.id} index={restaurant.id} onClick={this.handleAccordionClick}>
            <RestaurantItem key={restaurant.id} item={restaurant} avgRating={avgRating}/>
          </Accordion.Title>
          <Accordion.Content active={activeIndex === restaurant.id}>
            {reviews}
          </Accordion.Content>
        </div>
        )
      }
    );

    return (
      <div className='left-container-computer'>
        <Sticky>
          <Segment>
          <Menu stackable size='mini'>
            <Menu.Item>
              <img src={logoImg} alt='logo'/>
            </Menu.Item>
            <Menu.Item name='Info' active={activeItem === 'Info'} onClick={this.handleItemClick} />
            <Menu.Item
                name='Filter'
                active={activeItem === 'Filter'}
                onClick={this.handleItemClick}
            />
            <Menu.Menu position='right'>
              <Menu.Item>
                <SearchRestaurants />
              </Menu.Item>
            </Menu.Menu>
          </Menu>
          </Segment>
        </Sticky>

        <Segment>
          <ItemGroup divided>
            <Accordion styled>
              {restaurants}
            </Accordion>
          </ItemGroup>
        </Segment>
      </div>
    )
  }
}