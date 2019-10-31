// Import CSS
import '../css/style.css'

// Import images
import logoImg from '../img/logo.png'

// Import Components
import React from 'react'
import Map from "./Map";
import Filter from './Filter'
import RestaurantList from "./RestaurantList";
import { Menu, Segment, ItemGroup} from "semantic-ui-react";

export default class DataDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'Explore Restaurants',
      // width: window.innerWidth,
    };
  }

  // componentDidMount() {
  //   window.addEventListener('resize', this.handleWidthChange);
  // }
  //
  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.handleWidthChange);
  // }

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
            handleNewData, handleMinRate, handleMaxRate, handleReset, center,
            userMarker, userLocation, handleZoomChange, handleRestSearch,
            handleCenterChange, flags, windowWidth } = this.props;

    return (
      <div className='data-display'>
          <Segment>
          <Menu size='mini'>
            <Menu.Item>
              <img src={logoImg} alt='logo'/>
            </Menu.Item>
            <Menu.Item
              name='Explore Restaurants'
              active={activeItem === 'Explore Restaurants'}
              onClick={this.handleItemClick} />
            {windowWidth < 768 &&
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

        {activeItem === 'Explore Restaurants' &&
          <Segment>
            <ItemGroup divided>
              <RestaurantList
                restaurants={restaurants.filter(restaurant =>
                  restaurant.avgRating >= ratingMin &&
                  restaurant.avgRating <= ratingMax)}
                activeRest={activeRest}
                flags={flags}
                windowWidth={windowWidth}

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
        {windowWidth < 768 && activeItem === 'Map' &&
          <Segment className='segment-test'>
              <Map
                restaurants={restaurants.filter(restaurant =>
                  restaurant.avgRating >= ratingMin &&
                  restaurant.avgRating <= ratingMax)
                }
                center={center}
                flags={flags}
                userMarker={userMarker}
                userLocation={userLocation}
                activeRest={activeRest}

                handleRestSearch={handleRestSearch}
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