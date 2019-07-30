import React, { Component } from 'react'
import { Accordion, Icon } from 'semantic-ui-react'
import RestItem from './components/RestaurantItemCopy'
import ReviewItem from "./components/ReviewItem";

import './css/AppTest.css'

export default class AppTest extends Component {
  state = { activeIndex: 0 }

  handleClick = (e, titleProps) => {
    console.log(titleProps)
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  item = {
    "id": 0,
    "restaurantName":"Bronco",
    "address":"139 Maxim Road, London, UK",
    "flag": "fr",
    "desc": "A relaxed and vibrant afternoon food.",
    "lat":51.5138101,
    "long":-0.0819491,
    "ratings":[
      {
        "id": 11,
        "name": "Michael Max",
        "stars":4,
        "comment":"Great! But not many veggie options."
      },
      {
        "id": 12,
        "name": "Paul Histamine",
        "stars":4,
        "comment":"My favorite restaurant!"
      },
      {
        "id": 12,
        "name": "Paul Histamine",
        "stars":4,
        "comment":"My favorite restaurant!"
      },
      {
        "id": 12,
        "name": "Paul Histamine",
        "stars":4,
        "comment":"My favorite restaurant!"
      },
      {
        "id": 12,
        "name": "Paul Histamine",
        "stars":4,
        "comment":"My favorite restaurant!"
      },
      {
        "id": 12,
        "name": "Paul Histamine",
        "stars":4,
        "comment":"My favorite restaurant!"
      }
    ]
  };

  render() {
    const { activeIndex } = this.state
    let avgRating = this.item.ratings.map(rating => rating.stars).reduce((a,b) => a+b) / this.item.ratings.length;
    let reviews = this.item.ratings.map( review => <ReviewItem key={review.id} item={review} />)

    return (
        <Accordion styled>
          <Accordion.Title className='test' active={activeIndex === 0} index={0} onClick={this.handleClick}>
            <RestItem
              key={this.item.id}
              item={this.item}
              avgRating={avgRating}
            />
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            {reviews}
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
            <RestItem key={this.item.id} item={this.item} avgRating={avgRating} />
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <p>
              There are many breeds of dogs. Each breed varies in size and temperament. Owners often
              select a breed of dog that they find to be compatible with their own lifestyle and
              desires from a companion.
            </p>
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
            <Icon name='dropdown' />
            How do you acquire a dog?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>
            <p>
              Three common ways for a prospective owner to acquire a dog is from pet shops, private
              owners, or shelters.
            </p>
            <p>
              A pet shop may be the most convenient way to buy a dog. Buying a dog from a private
              owner allows you to assess the pedigree and upbringing of your dog before choosing to
              take it home. Lastly, finding your dog from a shelter, helps give a good home to a dog
              who may not find one so readily.
            </p>
          </Accordion.Content>
        </Accordion>
    )
  }
}
