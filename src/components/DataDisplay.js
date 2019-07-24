// Import Components
import React from 'react'
import RestaurantItem from "./RestaurantItem"
import { Menu , Segment } from "semantic-ui-react";
import ItemGroup from "semantic-ui-react/dist/commonjs/views/Item/ItemGroup"
import SearchRestaurants from "./SearchRestaurants"
import restaurantsARR from '../data/restaurants'

// Import images
import logoImg from '../img/logo.png'

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
          let avgRating = 0;
          for(let i = 0; i < restaurant.ratings.length; i++ ) {
            avgRating += restaurant.ratings[i].stars;
          }
          avgRating /= restaurant.ratings.length;
          // console.log(avgRating);
          return <RestaurantItem key={restaurant.id} item={restaurant} avgRating={avgRating}/>
      }
    );

    return (
        <div>
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

          <Segment>
            <ItemGroup divided>
              {restaurants}
            </ItemGroup>
          </Segment>
        </div>
    )
  }
}