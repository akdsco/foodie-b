// Import Components
import React from 'react'
import { Rating } from 'semantic-ui-react'

const AvgRatingComponent = (props) => <Rating size='tiny' defaultRating={props.avgRating} maxRating={5} disabled/>;
const SingleRatingComponent = (props) => <Rating size='tiny' icon='star' defaultRating={props.rating} maxRating={5} disabled />;
const AddReviewRatingComponent = (props) => {

  const handleRate = (e, {rating}) => {
    let name = 'reviewStars';
    let value = rating;
    props.handleChange(e, {name, value});
  };

  return(
  <Rating size='massive' icon='star' defaultRating={0} maxRating={5} onRate={handleRate} />)
};

export { AvgRatingComponent, SingleRatingComponent, AddReviewRatingComponent }
