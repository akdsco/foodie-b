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

export default class DataDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'Info',
      restaurants: restaurantsARR
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;
    const restaurants = this.state.restaurants.map( restaurant => {
          // find out average rating for each restaurant
          let avgRating = restaurant.ratings.map(rating => rating.stars).reduce((a,b) => a+b) / restaurant.ratings.length;
          console.log(avgRating);
          return <RestaurantItem key={restaurant.id} item={restaurant} avgRating={avgRating}/>
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
              {restaurants}
            </ItemGroup>
          </Segment>
        </div>
    )
  }
}