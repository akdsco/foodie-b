// Import CSS
import '../css/DataDisplay.css'

// Import images
import logoImg from '../img/logo.png'
import Sticky from "semantic-ui-react/dist/commonjs/modules/Sticky";

// Import Components
import React from 'react'
import {Menu, Segment} from "semantic-ui-react";
import ItemGroup from "semantic-ui-react/dist/commonjs/views/Item/ItemGroup"
import Filter from './Filter'
import RestaurantList from "./RestaurantList";

export default class DataDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'Info',
    };
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
    if(e.target.value === 'reset') {
      this.props.handleReset()
    }
  };

  // Testing Google Places API Fetch
  handleRestaurants = () => {
    console.log(this.props.restaurants)
  };

  handleActiveRest = () => {

  };

  render() {
    const { activeItem } = this.state;

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
            {/*<Menu.Menu position='right'>*/}
            {/*  <Menu.Item>*/}
            {/*    <SearchRestaurants />*/}
            {/*  </Menu.Item>*/}
            {/*</Menu.Menu>*/}
          </Menu>
          </Segment>
        </Sticky>

        {activeItem === 'Info' &&
          <Segment>
            <ItemGroup divided>
              <RestaurantList
                restaurants={this.props.restaurants.filter(restaurant =>
                  restaurant.avgRating >= this.props.ratingMin &&
                  restaurant.avgRating <= this.props.ratingMax)}
                activeRest={this.props.activeRest}
                handleActiveRest={this.props.handleActiveRest}
              />
            </ItemGroup>
          </Segment>
        }
        {activeItem === 'Filter' &&
          <Segment>
            <Filter
              ratingMax={this.props.ratingMax}
              ratingMin={this.props.ratingMin}
              handleMinRate={this.props.handleMinRate}
              handleMaxRate={this.props.handleMaxRate}
              handleItemClick={this.handleItemClick}
              handleReset={this.props.handleReset}
            />
          </Segment>
        }
      </div>
    )
  }
}