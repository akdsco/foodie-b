import React from 'react'
import {Button, Header, Icon, Image, Modal} from 'semantic-ui-react'
import ReviewItem from "./ReviewItem";
import ItemGroup from "semantic-ui-react/dist/commonjs/views/Item/ItemGroup";

const Reviews = () => (
    <Modal trigger={<Button size='tiny' floated='right'>Reviews <Icon name='dropdown' /></Button>}>
      <Modal.Header>Farmer J - Reviews</Modal.Header>
      <Modal.Content image>
        <Image wrapped size='medium' src='./fmj.jpg' />
        <Modal.Description>
          <Header>What People say about Farmer J</Header>
          <ItemGroup link>
            <ReviewItem />
            <ReviewItem />
            <ReviewItem />
            <ReviewItem />
            <ReviewItem />
          </ItemGroup>
        </Modal.Description>
      </Modal.Content>
    </Modal>
)

export default Reviews
