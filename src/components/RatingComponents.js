// Import Components
import React from 'react'
import { Rating } from 'semantic-ui-react'

const AvgRatingComponent = (props) => <Rating icon='star' defaultRating={props.avgRating} maxRating={5} disabled/>
const SingleRatingComponent = (props) => <Rating icon='star' defaultRating={props.rating} maxRating={5} disabled />

export { AvgRatingComponent, SingleRatingComponent }