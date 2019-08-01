// Import Data
import restaurantsJSON from '../data/restaurants'

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
      restaurants: restaurantsJSON,
      activeIndex: -1,
      ratingMin: 1,
      ratingMax: 5
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

  sortRestaurants() {
    // converts object into array
    return Object.keys(this.state.restaurants).map((rid) => this.state.restaurants[rid])
    // you can specify sorting here if you'd like in the future
  }

  render() {
    const { activeItem, activeIndex } = this.state;

    let filteredRestaurants = [];
    this.sortRestaurants().forEach( restaurant => {
      // calculate average rating for each restaurant
      restaurant.avgRating = restaurant.ratings.map( rating => rating.stars).reduce( (a , b ) => a + b ) / restaurant.ratings.length;
      // filter out restaurants based on selected rating range
      if(restaurant.avgRating <= this.state.ratingMax && restaurant.avgRating >= this.state.ratingMin) {
        // push qualified restaurants to array
        filteredRestaurants.push(restaurant)
      }
    });

    // fill array with react restaurant components
    let restaurantsList = [];
    filteredRestaurants.forEach( restaurant => {
      const reviews = restaurant.ratings.map( review => <ReviewItem key={review.id} item={review} />);

      restaurantsList.push(
        <div key={restaurant.id}>
          <Accordion.Title active={activeIndex === restaurant.id} index={restaurant.id} onClick={this.handleAccordionClick}>
            <RestaurantItem item={restaurant} avgRating={restaurant.avgRating}/>
          </Accordion.Title>
          <Accordion.Content active={activeIndex === restaurant.id}>
            {reviews}
          </Accordion.Content>
        </div>
        )
    });

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