// Import Data
import restaurantsARR from '../data/restaurants'

// Import CSS
import '../css/DataDisplay.css'

// Import images
import logoImg from '../img/logo.png'
import Sticky from "semantic-ui-react/dist/commonjs/modules/Sticky";
import Accordion from "semantic-ui-react/dist/commonjs/modules/Accordion";
import ReviewItem from "./ReviewItem";

// Import Components
import React from 'react'
import RestaurantItem from "./RestaurantItem"
import {Menu, Segment} from "semantic-ui-react";
import ItemGroup from "semantic-ui-react/dist/commonjs/views/Item/ItemGroup"
import SearchRestaurants from "./SearchRestaurants"
import Filter from './Filter'

export default class DataDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'Info',
      restaurants: restaurantsARR,
      activeIndex: -1,
      ratingMin: -1,
      ratingMax: -1
    };
    // this.handleItemClick = this.handleItemClick.bind(this);
    // this.handleAccordionClick = this.handleAccordionClick.bind(this);
    // this.handleMinRate = this.handleMinRate.bind(this);
    // this.handleMaxRate = this.handleMaxRate.bind(this);
  }

  handleItemClick = (e, { name }) => {
    console.log('handleIteClicked from Filter');
    console.log('max=' + this.state.ratingMax + ',min=' + this.state.ratingMin);
    this.setState({ activeItem: name });
  };

  handleAccordionClick = (e, titleProps) =>  {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({
      activeIndex: newIndex
    })
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
    console.log('state-min ' + this.state.ratingMin);
    if(this.state.ratingMin <= rating) {
      console.log('fired');
      this.setState({
        ratingMax: rating
      })
    }
  };

  render() {
    const { activeItem, activeIndex } = this.state;

    const restaurantsList = this.state.restaurants
      .map(rsnt => {
      // calculate average rating for each restaurant
        rsnt.avgRating = rsnt.ratings
          .map(rating => rating.stars)
          .reduce(( a , b ) => a + b ) / rsnt.ratings.length;
        return rsnt})
      .filter(rsnt => () => {
          if(this.state.ratingFilter.min === -1 && this.state.ratingFilter.max === -1) {
            console.log('returned first');
            return rsnt
          } else {
            console.log('returned second');
            return rsnt.avgRating >= this.state.ratingFilter.min && rsnt.avgRating <= this.state.ratingFilter.max }
          })
      .map( restaurant => {
        const reviews = restaurant.ratings.map(review => <ReviewItem key={review.id} item={review} />);

      return (
        <div key={restaurant.id}>
          <Accordion.Title active={activeIndex === restaurant.id} index={restaurant.id} onClick={this.handleAccordionClick}>
            <RestaurantItem item={restaurant} avgRating={restaurant.avgRating}/>
          </Accordion.Title>
          <Accordion.Content active={activeIndex === restaurant.id}>
            {reviews}
          </Accordion.Content>
        </div>
        )
      }
    );

    console.log(restaurantsList);

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
              {restaurantsList}
            </Accordion>
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
          />
        </Segment>
        }
      </div>
    )
  }
}