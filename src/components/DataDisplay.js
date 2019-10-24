// Import CSS
import '../css/style.css'

// Import images
import logoImg from '../img/logo.png'
import Sticky from "semantic-ui-react/dist/commonjs/modules/Sticky";

// Import Components
import React from 'react'
import { Menu, Segment } from "semantic-ui-react";
import ItemGroup from "semantic-ui-react/dist/commonjs/views/Item/ItemGroup"
import Filter from './Filter'
import RestaurantList from "./RestaurantList";
import Map from "./Map";

export default class DataDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'Explore Restaurants',
      width: window.innerWidth,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWidthChange);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWidthChange);
  }

  handleItemClick = (e, { name }) => {
    console.log(e, name);
    this.setState({ activeItem: name });
    if(e.target.value === 'reset') {
      this.props.handleReset()
    }
    console.log(this.state.activeItem);
  };

  handleWidthChange = () => {
    this.setState({width: window.innerWidth})
  };

  render() {
    const { activeItem, width} = this.state;
    const { restaurants, ratingMin, ratingMax, activeRest, handleActiveRest,
            handleNewData, handleMinRate, handleMaxRate, handleReset, center,
            userMarker, userLocation, handleZoomChange,
            handleCenterChange } = this.props;

    return (
      <div className='left-container-computer'>
        <Sticky>
          <Segment>
          <Menu size='mini'>
            <Menu.Item>
              <img src={logoImg} alt='logo'/>
            </Menu.Item>
            <Menu.Item
              name='Explore Restaurants'
              active={activeItem === 'Explore Restaurants'}
              onClick={this.handleItemClick} />
            {width < 767 &&
            <Menu.Item
              name='Map'
              active={activeItem === 'Map'}
              onClick={this.handleItemClick}
            />
            }
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
        {activeItem === 'Map' &&
          <Segment>
              <Map
                restaurants={restaurants.filter(restaurant =>
                  restaurant.avgRating >= ratingMin &&
                  restaurant.avgRating <= ratingMax)
                }
                center={center}
                userMarker={userMarker}
                userLocation={userLocation}
                activeRest={activeRest}

                handleNewData={handleNewData}
                handleZoomChange={handleZoomChange}
                handleActiveRest={handleActiveRest}
                handleCenterChange={handleCenterChange}
              />
          </Segment>
        }
      </div>
    )
  }
}