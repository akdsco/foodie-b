import React from 'react'
import {Button, Form} from "semantic-ui-react";
import {AddReviewRatingComponent} from './RatingComponents';

export default class AddReview extends React.Component {

// {
//   "id": 11,
//   "name": "Michael Max",
//   "stars":4,
//   "comment":"Great! But not many veggie options.",
//   "image_url": ""
// }

  state = {
    reviewStars: '',
    reviewContent: '',
    reviewersName: '',
    reviewersImgUrl: ''
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = () => {
    const { reviewStars, reviewContent, reviewersName, reviewersImgUrl } = this.state;

    const newReview = {
      "id": 'rev' + (this.props.restaurant.details.reviews.length + this.props.addedRestaurants.length),
      "name": reviewersName,
      "stars": reviewStars,
      "comment": reviewContent,
      "image_url": reviewersImgUrl
    };

    console.log(newReview);
    this.props.handleNewReview(newReview);
  };

  render() {
    const { reviewContent, reviewersName } = this.state;

    return(
      <Form onSubmit={this.props.handleClose}>
        <Form.Field required>
          <label>How many stars?</label>
          <AddReviewRatingComponent handleChange={this.handleChange} />
        </Form.Field>
        <Form.Field required>
          <label>What did you like in particular?</label>
          <Form.TextArea
            placeholder='Tell us your thoughts...'
            name='reviewContent'
            type='text'
            value={reviewContent}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Form.Field required>
          <label>Your Name</label>
          <Form.Input
            placeholder="e.g. John Dough"
            name='reviewersName'
            value={reviewersName}
            onChange={this.handleChange}
          />
        </Form.Field>

        {/*<Button.Group>*/}
          <Button onClick={this.handleSubmit} positive>Add Review</Button>
          {/*<Button.Or />*/}
          {/*<Button onClick={this.handleReset}>forget it</Button>*/}
        {/*</Button.Group>*/}
      </Form>
    )
  }
}