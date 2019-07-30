// Import Components

import React from 'react'
import {Button, Icon, Image, Modal} from 'semantic-ui-react/index'
import ReviewItem from "../ReviewItem";
import ItemGroup from "semantic-ui-react/dist/commonjs/views/Item/ItemGroup";

export default class Reviews extends React.Component {

  render() {

    const restaurantReviews = this.props.item.ratings.map( review => <ReviewItem key={review.id} item={review}  />);

    return (
      <Modal trigger={<Button size='tiny' floated='right'>Reviews <Icon name='dropdown'/></Button>}>
        <Modal.Header>What People say about {this.props.item.restaurantName}</Modal.Header>
        <Modal.Content image>
          <Image wrapped size='medium' src='./fmj.jpg'/>
          <Modal.Description>
            <ItemGroup>
              {restaurantReviews}
            </ItemGroup>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
  }
}