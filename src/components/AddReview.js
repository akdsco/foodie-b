// Imports
import React from 'react'
// Components
import {AddReviewRatingComponent} from './RatingComponents';
// Dependencies
import {Button, Form} from "semantic-ui-react";

export default class AddReview extends React.Component {
  state = {
    reviewStars: '',
    reviewContent: '',
    reviewersName: '',
    reviewersImgUrl: ''
  };

  /* ===================
   *   Handler Methods
  _* ===================
*/

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = (e, { name, value }) => {
    e.preventDefault();
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
    const { reviewContent, reviewersName, reviewStars } = this.state;
    const { handleChange, handleSubmit } = this;

    return(
      <Form>
        <Form.Field required>
          <label>How many stars?</label>
          <AddReviewRatingComponent handleChange={handleChange} />
        </Form.Field>
        <Form.Field required>
          <label>What did you like in particular?</label>
          <Form.TextArea
            placeholder='Tell us your thoughts. (min. 5 characters)'
            name='reviewContent'
            type='text'
            value={reviewContent}
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Field required>
          <label>Your Name</label>
          <Form.Input
            placeholder="e.g. John Dough (min. 3 characters)"
            name='reviewersName'
            value={reviewersName}
            onChange={handleChange}
          />
        </Form.Field>

        <Button
          name='addReviewModalOpen'
          value={false}
          disabled={reviewStars === '' ||
                    reviewersName.length < 3 ||
                    reviewContent.length < 5}
          onClick={handleSubmit}
          positive
        >
          Add Review
        </Button>
      </Form>
    )
  }
}