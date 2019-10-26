// Import Images
import logoImg from '../img/logo.png';

// Import Components
import React from 'react';
import {Form, Checkbox, Button, Modal, Image, Header} from 'semantic-ui-react';

//TODO make sure required fields work, as of now you can fill form without lat and lng and it will still add new restaurant

export default class AddRestaurant extends React.Component {
  state = {
    modalOpen: false,
    restName: '',
    imageUrl: '',
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleCancel = () => {
    this.setState({ modalOpen: false});
    this.props.closeInfoWindow();
  };

  handleSubmit = () => {
    const { newRestData, restaurants } = this.props;
    const { restName, imageUrl } = this.state;
    const id = restaurants.length;

    const newRestaurant = {
      "id": id,
      "restaurantName": restName,
      "address": newRestData.address,
      "lat": newRestData.lat,
      "long": newRestData.lng,
      "isFromFile": true,
      "place_id": "",
      "avgRating": 0,
      "numberOfReviews": 0,
      "details": {
        "reviews": [],
        "photoUrl": imageUrl
      }
    };

    this.props.handleNewData(newRestaurant, 'restaurant');

    this.handleCancel();
  };

  render() {
    const { restName, imageUrl, modalOpen } = this.state;
    const { closeInfoWindow } = this.props;
    const { handleChange, handleCancel, handleSubmit } = this;

    return(
      <div>
        <Button.Group>
          <Button
            onClick={handleChange}
            positive
            value={true}
            name='modalOpen'
          > Add </Button>
          <Button.Or />
          <Button onClick={closeInfoWindow}>Cancel</Button>
        </Button.Group>

        <Modal
          open={modalOpen}
          onClose={handleCancel}
        >
          <Modal.Content image>
            <Image wrapped size='medium' src={logoImg} />

            <Modal.Description>
              <Header>Add New Restaurant Details</Header>
              <Form>
                <Form.Field required>
                  <label>Restaurant Name</label>
                  <Form.Input
                    placeholder="e.g. Pizza Express"
                    name='restName'
                    value={restName}
                    onChange={handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Image URL</label>
                  <Form.Input
                    placeholder='e.g. http://mcdonalds.com/main-photo.jpg'
                    name='imageUrl'
                    value={imageUrl}
                    onChange={handleChange}
                  />
                </Form.Field>

                <Form.Field required>
                  <Checkbox label='I agree to the Terms and Conditions' />
                </Form.Field>
                <Button.Group>
                  <Button onClick={handleSubmit} positive>Submit</Button>
                  <Button.Or />
                  <Button onClick={handleCancel}>Cancel</Button>
                </Button.Group>
              </Form>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </div>
    )
  }

}