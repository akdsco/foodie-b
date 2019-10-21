import React from 'react'
import {Button, Form} from "semantic-ui-react";
import {AddReviewRatingComponent} from './RatingComponents';

export default class AddReview extends React.Component {
  state = {
    reviewStars: '',
    reviewContent: '',
    reviewersName: '',
    reviewersImgUrl: ''
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = (e, { name, value }) => {
    const { reviewStars, reviewContent, reviewersName, reviewersImgUrl } = this.state;
    const { restaurant, handleNewData, handleClose} = this.props;

    const newReview = {
      "id": 'rev' + restaurant.details.reviews.length,
      "name": reviewersName,
      "stars": reviewStars,
      "comment": reviewContent,
      "image_url": reviewersImgUrl
    };

    handleNewData(newReview, 'review');
    handleClose(e, {name, value});
  };

  render() {
    const { reviewContent, reviewersName } = this.state;
    const { handleChange, handleSubmit } = this;
    const { handleClose } = this.props;

    return(
      <Form onSubmit={handleClose}>
        <Form.Field required>
          <label>How many stars?</label>
          <AddReviewRatingComponent handleChange={handleChange} />
        </Form.Field>
        <Form.Field required>
          <label>What did you like in particular?</label>
          <Form.TextArea
            placeholder='Tell us your thoughts...'
            name='reviewContent'
            type='text'
            value={reviewContent}
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Field required>
          <label>Your Name</label>
          <Form.Input
            placeholder="e.g. John Dough"
            name='reviewersName'
            value={reviewersName}
            onChange={handleChange}
          />
        </Form.Field>

        <Button
          name='addReviewModalOpen'
          value={false}
          onClick={handleSubmit}
          positive
        >
          Add Review
        </Button>
      </Form>
    )
  }
}