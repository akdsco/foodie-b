// Imports
import React from 'react';
// Images
import logoImg from '../img/logo.png';
// Dependencies
import {Form, Checkbox, Button, Modal, Image, Header} from 'semantic-ui-react';

export default class AddRest extends React.Component {
  state = {
    modalOpen: false,
    restName: '',
    phoneNumber: '',
    imageUrl: '',
    restUrl: '',
    isTermsChecked: false,
  };

  /* ===================
   *   Handler Methods
  _* ===================
*/

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleCancel = () => {
    this.setState({ modalOpen: false});
    this.props.closeInfoWindow();
  };

  handleSubmit = () => {
    const { newRestData, restaurants } = this.props;
    const { restName, imageUrl, phoneNumber, restUrl } = this.state;
    const id = restaurants.length;

    const newRestaurant = {
      "id": id,
      "restaurantName": restName,
      "address": newRestData.address,
      "lat": newRestData.lat,
      "lng": newRestData.lng,
      "streetViewURL": 'https://maps.googleapis.com/maps/api/streetview?size=500x300&location='+ newRestData.lat +','+ newRestData.lng +'&heading=151.78&pitch=-0.76&key='+ process.env.REACT_APP_G_API,
      "isFromFile": true,
      "place_id": "",
      "avgRating": 0,
      "numberOfReviews": 0,
      "details": {
        "reviews": [],
        "photoUrl": imageUrl,
        "phoneNumber": phoneNumber,
        "link": restUrl,
      }
    };

    this.props.handleNewData(newRestaurant, 'restaurant');

    this.handleCancel();
  };

  render() {
    const { closeInfoWindow } = this.props;
    const { handleChange, handleCancel, handleSubmit } = this;
    const { restName, imageUrl, modalOpen, isTermsChecked, phoneNumber,restUrl } = this.state;

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
                    placeholder="e.g. Pizza Express (min. 4 characters)"
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
                <Form.Field>
                  <label>Phone Number</label>
                  <Form.Input
                    placeholder='e.g. 07456066789'
                    name='phoneNumber'
                    value={phoneNumber}
                    onChange={handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Restaurant Website</label>
                  <Form.Input
                    placeholder='e.g. http://www.restaurant-name.com'
                    name='restUrl'
                    value={restUrl}
                    onChange={handleChange}
                  />
                </Form.Field>

                <Form.Field required>
                  <Checkbox
                    checked={isTermsChecked}
                    name='isTermsChecked'
                    onClick={handleChange}
                    value={!isTermsChecked}
                    label='I agree to the Terms and Conditions' required/>
                </Form.Field>
                <Button.Group>
                  <Button
                    disabled={restName.length <= 3 || !isTermsChecked}
                    onClick={handleSubmit} positive
                  >Submit</Button>
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