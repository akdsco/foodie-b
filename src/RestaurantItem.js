import React, { Component } from 'react'
import { Button, Menu, Segment } from 'semantic-ui-react'
import RestaurantItemInfo from "./RestaurantItemInfo";
import ItemGroup from "semantic-ui-react/dist/commonjs/views/Item/ItemGroup";
import RestaurantAccordion from "./RestaurantAccordion";

export default class RestaurantItem extends Component {
  state = { activeItem: 'Info' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
        <div>
          <Segment>
          <Menu pointing secondary>
            <Menu.Item name='Info' active={activeItem === 'Info'} onClick={this.handleItemClick} />
            {/*<Button active={activeItem === 'Info'} onClick={this.handleItemClick}>Info</Button>*/}
            <Menu.Item
                name="Other Function"
                active={activeItem === 'Other Function'}
                onClick={this.handleItemClick}
            />
            <Menu.Menu position='right'>
              <Menu.Item
                  name='Filter'
                  active={activeItem === 'Filter'}
                  onClick={this.handleItemClick}
              />
            </Menu.Menu>
          </Menu>
          </Segment>

          <Segment>
            <ItemGroup divided>
              <RestaurantItemInfo />
              <RestaurantItemInfo />
              <RestaurantItemInfo />
              <RestaurantItemInfo />
            </ItemGroup>
          </Segment>
        </div>
    )
  }
}