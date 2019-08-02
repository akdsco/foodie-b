// Import CSS
import '../css/DataDisplay.css'

// Import images
import logoImg from '../img/logo.png'
import Sticky from "semantic-ui-react/dist/commonjs/modules/Sticky";
import Accordion from "semantic-ui-react/dist/commonjs/modules/Accordion";

// Import Components
import React from 'react'
import {Menu, Segment} from "semantic-ui-react";
import ItemGroup from "semantic-ui-react/dist/commonjs/views/Item/ItemGroup"
import SearchRestaurants from "./SearchRestaurants"
import Filter from './Filter'

export default class DataDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'Info',
    };
  }

  handleItemClick = (e, { name }) => {
    console.log(e);
    this.setState({ activeItem: name });
    if(e.target.value === 'reset') {
      this.props.handleReset()
    }
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
            <Accordion styled>
              {this.props.restaurantsList}
            </Accordion>
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
            handleReset={this.handleReset}
          />
        </Segment>
        }
      </div>
    )
  }
}