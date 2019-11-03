// Imports
import React from 'react'
// CSS
import '../css/style.css'
// Images
import logoImg from '../img/logo.png'
// Components
import Map from "./Map";
import Filter from './Filter'
import RestList from "./RestList";
// Dependencies
import { Menu, Segment, ItemGroup} from "semantic-ui-react";

export default class DataDisplay extends React.Component {
  state = {
    activeMenuItem: 'Restaurants',
  };

  /* ===================
   *   Handler Methods
  _* ===================
*/

  handleMenuItemClick = (e, { name }) => {
    this.setState({ activeMenuItem: name });
    if(e.target.value === 'reset') {
      this.props.handleReset()
    }
  };

  render() {
    const { activeMenuItem } = this.state;
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
              name='Restaurants'
              active={activeMenuItem === 'Restaurants'}
              onClick={this.handleMenuItemClick} />
            {windowWidth < 768 &&
            <Menu.Item
              name='Map'
              active={activeMenuItem === 'Map'}
              onClick={this.handleMenuItemClick}
            />
            }
            <Menu.Menu position='right'>
              <Menu.Item
                name='Filter'
                active={activeMenuItem === 'Filter'}
                onClick={this.handleMenuItemClick}
              />
            </Menu.Menu>
          </Menu>
          </Segment>

        {activeMenuItem === 'Restaurants' &&
          <Segment>
            <ItemGroup divided>
              <RestList
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
        {activeMenuItem === 'Filter' &&
          <Segment>
            <Filter
              ratingMax={ratingMax}
              ratingMin={ratingMin}
              handleMinRate={handleMinRate}
              handleMaxRate={handleMaxRate}
              handleReset={handleReset}
              handleItemClick={this.handleMenuItemClick}
            />
          </Segment>
        }
        {windowWidth < 768 && activeMenuItem === 'Map' &&
          <Segment className='data-display-menu-segment'>
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