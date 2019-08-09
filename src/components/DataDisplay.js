// Import CSS
import '../css/DataDisplay.css'

// Import images
import logoImg from '../img/logo.png'
import Sticky from "semantic-ui-react/dist/commonjs/modules/Sticky";

// Import Components
import React from 'react'
import {Menu, Segment} from "semantic-ui-react";
import ItemGroup from "semantic-ui-react/dist/commonjs/views/Item/ItemGroup"
import SearchRestaurants from "./SearchRestaurants"
import Filter from './Filter'
import RestaurantList from "./RestaurantList";

export default class DataDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'Info',
      ratingMin: 1,
      ratingMax: 5
    };
  }

  handleItemClick = (e, { name }) => {
    console.log(e);
    this.setState({ activeItem: name });
    if(e.target.value === 'reset') {
      this.props.handleReset()
    }
  };

  handleMinRate = (e, { rating }) => {
    console.log('min ' + rating);
    if((this.state.ratingMax > 0) && (rating < this.state.ratingMax)) {
      this.setState({
        ratingMin: rating
      })
    } else {
      this.setState({
        ratingMin: rating,
        ratingMax: rating
      })
    }
  };

  handleMaxRate = (e, { rating }) => {
    console.log('max ' + rating);
    if(this.state.ratingMin <= rating) {
      this.setState({
        ratingMax: rating
      })
    }
  };

  handleReset = () => {
    this.setState({
      ratingMin: 1,
      ratingMax: 5
    })
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
            <Menu.Menu position='right'>
              <Menu.Item>
                <SearchRestaurants />
              </Menu.Item>
            </Menu.Menu>
          </Menu>
          </Segment>
        </Sticky>

        {activeItem === 'Info' &&
            <Segment>
              <ItemGroup divided>
                <RestaurantList
                  restaurants={this.props.restaurantsList.filter(restaurant =>
                    restaurant.avgRating >= this.state.ratingMin &&
                    restaurant.avgRating <= this.state.ratingMax)}
                />
              </ItemGroup>
            </Segment>
        }
        {activeItem === 'Filter' &&
        <Segment>
          <Filter
            ratingMax={this.state.ratingMax}
            ratingMin={this.state.ratingMin}
            handleMinRate={this.handleMinRate}
            handleMaxRate={this.handleMaxRate}
            handleItemClick={this.handleItemClick}
            handleReset={this.handleReset}
          />
        </Segment>
        }
      </div>
    )
  }
}