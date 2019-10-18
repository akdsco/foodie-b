import React from 'react';
import {Form, Checkbox, Button} from 'semantic-ui-react';

//TODO make sure required fields work, as of now you can fill form without lat and lng and it will still add new restaurant

export default class AddRestaurant extends React.Component {
  state = {
    restName: '',
    address: '',
    latitude: '',
    longitude: '',
    imageUrl: '',
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = () => {
    const { restName, address, latitude, longitude, imageUrl } = this.state;

    const newRestaurant = {
      "id": this.props.restaurants.length,
      "restaurantName": restName,
      "address": address,
      "desc": "A relaxed and vibrant afternoon food.",
      "lat": parseFloat(latitude),
      "long": parseFloat(longitude),
      "avgRating": 5,
      "details": {
        "reviews": [],
        "photoUrl": imageUrl
      }
    };

    console.log(newRestaurant);
    this.props.handleNewData(newRestaurant, 'restaurant');
  };

  render() {
    const { restName, address, latitude, longitude, imageUrl } = this.state;
    const { handleItemClick } = this.props;

    return(
      <Form onSubmit={this.handleSubmit}>
        <Form.Field required>
          <label>Restaurant Name</label>
          <Form.Input
            placeholder="e.g. Pizza Express"
            name='restName'
            value={restName}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Form.Field required>
          <label>Address</label>
          <Form.Input
            placeholder='e.g. 123 Broad Street, London'
            name='address'
            value={address}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Form.Field required type='number'>
          <label>Geo Latitude</label>
          <Form.Input
            placeholder='e.g. 51.516126'
            name='latitude'
            type='number'
            value={latitude}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Form.Field required type='number'>
          <label>Geo Longitude</label>
          <Form.Input
            placeholder='e.g. -0.081679'
            name='longitude'
            type='number'
            value={longitude}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Image URL</label>
          <Form.Input
            placeholder='e.g. http://mcdonalds.com/main-photo.jpg'
            name='imageUrl'
            value={imageUrl}
            onChange={this.handleChange}
          />
        </Form.Field>

        <Form.Field required>
          <Checkbox label='I agree to the Terms and Conditions' />
        </Form.Field>
        <Button.Group>
          <Button content='Submit' positive>Submit</Button>
          <Button.Or />
          <Button onClick={handleItemClick} name='Explore Restaurants'>Cancel</Button>
        </Button.Group>
        {/*<Form.Button content='Submit' />*/}
        {/*<Button type='submit'*/}
        {/*        name='Explore Restaurants'*/}
        {/*>Submit</Button>*/}
      </Form>
    )
  }
}