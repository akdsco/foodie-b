// Import CSS
import '../css/style.css'

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
      activeItem: 'Explore Restaurants',
    };
  }

  handleItemClick = (e, { name }) => {
    console.log(e, name);
    this.setState({ activeItem: name });
    if(e.target.value === 'reset') {
      this.props.handleReset()
    }
    console.log(this.state.activeItem);
  };

  render() {
    const { activeItem } = this.state;
    const { restaurants, ratingMin, ratingMax, activeRest, handleActiveRest,
            handleNewData, handleMinRate, handleMaxRate, handleReset} = this.props;

    return (
      <div className='left-container-computer'>
        <Sticky>
          <Segment>
          <Menu stackable size='mini'>
            <Menu.Item>
              <img src={logoImg} alt='logo'/>
            </Menu.Item>
            <Menu.Item
              name='Explore Restaurants'
              active={activeItem === 'Explore Restaurants'}
              onClick={this.handleItemClick} />
            <Menu.Menu position='right'>
              <Menu.Item
                name='Filter'
                active={activeItem === 'Filter'}
                onClick={this.handleItemClick}
              />
            </Menu.Menu>
          </Menu>
          </Segment>
        </Sticky>

        {activeItem === 'Explore Restaurants' &&
          <Segment>
            <ItemGroup divided>
              <RestaurantList
                restaurants={restaurants.filter(restaurant =>
                  restaurant.avgRating >= ratingMin &&
                  restaurant.avgRating <= ratingMax)}
                activeRest={activeRest}

                handleNewData={handleNewData}
                handleActiveRest={handleActiveRest}
              />
            </ItemGroup>
          </Segment>
        }
        {activeItem === 'Filter' &&
          <Segment>
            <Filter
              ratingMax={ratingMax}
              ratingMin={ratingMin}

              handleMinRate={handleMinRate}
              handleMaxRate={handleMaxRate}
              handleReset={handleReset}
              handleItemClick={this.handleItemClick}
            />
          </Segment>
        }
      </div>
    )
  }
}